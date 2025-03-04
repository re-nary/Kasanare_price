const React = window.React;
const ReactDOM = window.ReactDOM;

// ここから元のReactコンポーネントのコード
const PricingConfigurator = () => {
  // 機能とランクの定義
  const features = [
    {
      id: 'rag-tuning',
      name: 'RAG / Tuning',
      description: 'AIモデルのRAG構築とチューニング',
      ranks: [
        { 
          id: 'entry', 
          name: 'Entry', 
          description: '専用RAG構築、プロンプトエンジニアリング', 
          points: 3 
        },
        { 
          id: 'basic', 
          name: 'Basic', 
          description: 'ワークフローに沿った専用RAG構築、ご準備頂いた評価指標を用いた評価/テスト/修正、AdvancedRAG等の各種RAG/ロジック検証', 
          points: 5 
        },
        { 
          id: 'advanced', 
          name: 'Advanced', 
          description: 'ワークフローに沿った専用RAG構築、専用評価指標を用いた評価/テスト/修正、AdvancedRAG等の各種RAG/ロジック検証', 
          points: 6 
        }
      ]
    },
    {
      id: 'security',
      name: 'Security',
      description: 'セキュリティアーキテクチャの実装',
      ranks: [
        { 
          id: 'entry', 
          name: 'Entry', 
          description: 'Aアーキテクチャ（Azureの基本的なアーキテクチャ）', 
          points: 1 
        },
        { 
          id: 'basic', 
          name: 'Basic', 
          description: 'Aアーキテクチャ（Azureの基本的なアーキテクチャ）、必要に応じてカスタマイズ', 
          points: 2 
        },
        { 
          id: 'advanced', 
          name: 'Advanced', 
          description: 'Bアーキテクチャ（セキュアなAzureアーキテクチャ）、必要に応じてカスタマイズ', 
          points: 5 
        }
      ]
    },
    {
      id: 'ui',
      name: 'UI',
      description: 'ユーザーインターフェースの開発',
      ranks: [
        { 
          id: 'entry', 
          name: 'Entry', 
          description: '既存UIより選択（チャット、アバター）', 
          points: 1 
        },
        { 
          id: 'basic', 
          name: 'Basic', 
          description: '既存UIカスタマイズ', 
          points: 2 
        },
        { 
          id: 'advanced', 
          name: 'Advanced', 
          description: '新規UI開発', 
          points: 6 
        }
      ]
    },
    {
      id: 'data',
      name: 'Data',
      description: 'データ管理と処理',
      ranks: [
        { 
          id: 'entry', 
          name: 'Entry', 
          description: '〜100ファイル程度、図/表データは取り扱わない、PDF形式のみ', 
          points: 3 
        },
        { 
          id: 'basic', 
          name: 'Basic', 
          description: 'ドキュメント量応相談、図/表データは検索対象とする（レベル2）、各種ドキュメント形式に対応', 
          points: 6 
        },
        { 
          id: 'advanced', 
          name: 'Advanced', 
          description: 'ドキュメント量応相談、図/表データに含まれる意味的コンテキストもデータソースとする（レベル3）、各種ドキュメント形式に対応', 
          points: 10 
        }
      ]
    },
    {
      id: 'data-pipeline',
      name: 'Data pipeline for LLM',
      description: 'データの受け渡し',
      ranks: [
        { 
          id: 'entry', 
          name: 'Entry', 
          description: 'メールでの受け渡し、手動更新', 
          points: 1 
        },
        { 
          id: 'basic', 
          name: 'Basic', 
          description: 'GoogleDrive/BoxとのAPI連携、バッヂ処理等による自動更新構築', 
          points: 5 
        },
        { 
          id: 'advanced', 
          name: 'Advanced', 
          description: 'Kasanare Data pipelineとのAPI連携、バッヂ処理等による自動更新構築', 
          points: 8 
        }
      ]
    },
    {
      id: 'certification',
      name: 'Certification',
      description: '認証システム',
      ranks: [
        { 
          id: 'entry', 
          name: 'Entry', 
          description: 'ベーシック認証、IPアドレス制限', 
          points: 1 
        },
        { 
          id: 'basic', 
          name: 'Basic', 
          description: 'SSO認証（Azure EntraID、HENNGE）', 
          points: 2 
        },
        { 
          id: 'advanced', 
          name: 'Advanced', 
          description: 'SSO認証（独自認証基盤）', 
          points: 3 
        }
      ]
    }
  ];

  // 料金体系
  const pricingTiers = {
    initial: [
      { maxPoints: 10, price: '5,000,000円' },
      { maxPoints: 20, price: '〜15,000,000円' },
      { minPoints: 21, price: '20,000,000円〜' }
    ],
    running: [
      { maxPoints: 10, price: '320,000円' },
      { maxPoints: 20, price: '640,000円' },
      { minPoints: 21, price: '1,000,000円〜' }
    ]
  };

  // 初期状態では各機能をEntryに設定
  const initialSelections = features.reduce((acc, feature) => {
    acc[feature.id] = 'entry';
    return acc;
  }, {});

  const [selectedRanks, setSelectedRanks] = React.useState(initialSelections);
  const [totalPoints, setTotalPoints] = React.useState(0);
  const [initialPrice, setInitialPrice] = React.useState('');
  const [runningPrice, setRunningPrice] = React.useState('');

  // ポイント計算と料金設定
  React.useEffect(() => {
    let points = 0;
    features.forEach(feature => {
      const selectedRank = feature.ranks.find(rank => rank.id === selectedRanks[feature.id]);
      if (selectedRank) {
        points += selectedRank.points;
      }
    });
    
    setTotalPoints(points);
    
    // イニシャル料金設定
    if (points <= 10) {
      setInitialPrice(pricingTiers.initial[0].price);
    } else if (points <= 20) {
      setInitialPrice(pricingTiers.initial[1].price);
    } else {
      setInitialPrice(pricingTiers.initial[2].price);
    }
    
    // ランニング料金設定
    if (points <= 10) {
      setRunningPrice(pricingTiers.running[0].price);
    } else if (points <= 20) {
      setRunningPrice(pricingTiers.running[1].price);
    } else {
      setRunningPrice(pricingTiers.running[2].price);
    }
  }, [selectedRanks]);

  // ランク選択の変更ハンドラ
  const handleRankChange = (featureId, rankId) => {
    setSelectedRanks(prev => ({
      ...prev,
      [featureId]: rankId
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">AI SaaS セミオーダープラン</h2>
        <p className="text-xl text-gray-600">お客様の要件に合わせてカスタマイズ可能なAIソリューション</p>
      </div>
      
      {/* 機能選択セクション */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {features.map(feature => (
          <div key={feature.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.name}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feature.ranks.map(rank => (
                <div 
                  key={rank.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedRanks[feature.id] === rank.id 
                      ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md' 
                      : 'bg-gray-100 border border-gray-300 hover:bg-indigo-50'
                  }`}
                  onClick={() => handleRankChange(feature.id, rank.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-indigo-800">{rank.name}</span>
                    <span className="text-gray-800 font-bold">
                      {rank.points} ポイント
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rank.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 合計ポイントと料金 */}
      <div className="bg-indigo-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold mb-1">あなたのカスタムプラン</h3>
            <p className="text-indigo-200">
              要件に合わせたセミオーダー構成
            </p>
          </div>
          <div className="text-center md:text-right bg-indigo-800 p-4 rounded-lg">
            <div className="text-lg mb-1">合計ポイント</div>
            <div className="text-4xl font-bold">
              {totalPoints} <span className="text-indigo-300">pt</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-indigo-800 p-4 rounded-lg">
            <div className="text-lg mb-2">イニシャル（初期開発）</div>
            <div className="text-2xl font-bold">{initialPrice}</div>
          </div>
          <div className="bg-indigo-800 p-4 rounded-lg">
            <div className="text-lg mb-2">ランニング（運用保守）</div>
            <div className="text-2xl font-bold">{runningPrice}<span className="text-lg font-normal"> / 月</span></div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md">
            この構成でお問い合わせする
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>すべての料金は税抜きです。利用規約が適用されます。</p>
        <p className="mt-2">企業規模や利用状況に応じた特別プランについては、営業担当までお問い合わせください。</p>
      </div>
    </div>
  );
};

// レンダリング部分
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PricingConfigurator />);
