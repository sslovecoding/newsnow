// 定义目标网址返回的数据结构接口
interface TgbStockResponse {
  status: boolean;
  errorCode: number;
  errorMessage: string;
  dto: TgbStockItem[];
  _t: number;
}

interface TgbStockItem {
  fullCode: string;      // 股票代码（如 "sz000592"）
  stockName: string;     // 股票名称（如 "平潭发展"）
  ranking: number;       // 排名
  remark: string | null;
  continuenum: number;   // 连续涨停天数
  stockGn: string | null;
  gnList: GnItem[];      // 概念列表
  popularValue: number;  // 人气值
  rankRate: number | null;
  implied: string | null;
  reason: string;        // 原因说明
  linkingBoard: string;  // 连板情况（如 "15天11板"）
}

interface GnItem {
  ztgnSeq: number;
  gnName: string;
}

// 定义最终返回的数据结构（参考示例代码格式）
interface StockItem {
  id: string;           // 股票代码
  url: string;          // 股票详情页URL
  title: string;        // 股票名称
  extra: {
    info: string;       // 额外信息（连板情况 + 人气值）
    ranking: number;    // 排名
    continuenum: number; // 连续涨停天数
    reason: string;     // 原因说明
  };
}

// 主函数：获取并处理股票数据
async function getNoticeStocks(): Promise<StockItem[]> {
  try {
    const url = "https://www.tgb.cn/new/nrnt/getNoticeStock?type=H";
    
    // 使用fetch获取数据
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: TgbStockResponse = await response.json();
    
    // 检查API返回状态
    if (!data.status) {
      throw new Error(`API error: ${data.errorMessage}`);
    }
    
    // 映射数据到目标格式
    return data.dto.map((item: TgbStockItem) => ({
      id: item.fullCode,
      url: `https://www.tgb.cn/quotes/${item.fullCode}`, 
      title: item.stockName,
      extra: {
        info: `${item.linkingBoard} | 人气: ${item.popularValue}`,
        ranking: item.ranking,
        continuenum: item.continuenum,
        reason: item.reason || '无说明'
      }
    }));
    
  } catch (error) {
    console.error('获取股票数据失败:', error);
    throw error;
  }
}


