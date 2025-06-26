
import fetch from 'node-fetch';
import prisma from '../../pisma';

async function fetchHistoricalPrices(codigo: string, start: string) {
  const resp = await fetch(
    `https://brapi.dev/api/historical-price-full/${codigo}?from=${start}&to=${new Date().toISOString().slice(0,10)}`
  );
  const json = await resp.json();
  return json.historical;
}

async function updateInvestmentReturn(userInvestmentId: number) {
  const inv = await prisma.userinvestment.findUnique({
    where: { id: userInvestmentId },
    include: { investmentproduct: true },
  });
  if (!inv) throw new Error('Investimento não encontrado');

  const hist = await fetchHistoricalPrices(
    inv.investmentproduct.codigo_produto,
    inv.data_inicio.toISOString().slice(0,10)
  );
  if (!hist || hist.length === 0) throw new Error('Histórico vazio');

  const precoCompra = Number(inv.valor_unitario_medio);
  const precoAtual  = Number(hist[0].close);   
  const qtd          = Number(inv.quantidade);


  const retornoTotal = (precoAtual - precoCompra) / precoCompra;       
  const custoPeriodo = qtd * precoAtual;                              

  await prisma.investmentreturn.upsert({
    where: {
      user_investment_id_data_referencia: {
        user_investment_id: userInvestmentId,
        data_referencia: new Date().toISOString().slice(0,10),
      }
    },
    create: {
      user_investment_id: userInvestmentId,
      data_referencia:  new Date(),
      valor_fechamento:  precoAtual,
      rentabilidade_periodo: retornoTotal,
      custo_total_periodo:   custoPeriodo,
    },
    update: {
      valor_fechamento:  precoAtual,
      rentabilidade_periodo: retornoTotal,
      custo_total_periodo:   custoPeriodo,
    },
  });

  return { userInvestmentId, retornoTotal, custoPeriodo };
}

