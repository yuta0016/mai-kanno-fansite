import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            お問い合わせ
          </h1>
          <p className="text-gray-600 mb-2">
            サイトに関するご質問、改善案、不具合報告、ご要望などをお寄せください
          </p>
          <p className="text-sm text-gray-500">
            ※ 全てのお問い合わせに返信できるわけではございませんので、予めご了承ください
          </p>
        </header>

        {/* 問い合わせ方法 */}
        <div className="space-y-6">
          {/* Googleフォーム */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-12 h-12 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Googleフォーム
                </h2>
                <p className="text-gray-600 mb-4">
                  詳細なご意見・ご要望をお送りいただけます。
                  以下のような内容をお気軽にお寄せください：
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>サイトの改善案・追加してほしい機能</li>
                  <li>不具合・エラーの報告</li>
                  <li>掲載情報の誤りの指摘</li>
                  <li>その他のご質問・ご要望</li>
                </ul>
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe7j2I3FvJTpRMr2KFOMeanfn-vhVPGnLITN8U-YeZivsXWFg/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-md"
                >
                  <span>Googleフォームで問い合わせる</span>
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Xアカウント */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-12 h-12 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  X (旧Twitter)
                </h2>
                <p className="text-gray-600 mb-4">
                  お気軽にリプライやDMでお問い合わせください。
                  簡単なご質問やご連絡にご利用いただけます。
                </p>
                <Link
                  href="https://x.com/maimai_fan_info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-md"
                >
                  <span>@maimai_fan_info をフォロー</span>
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">ご注意</h3>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• このサイトは菅野真衣さんの非公式ファンサイトです</li>
                <li>• 所属事務所や公式サイトとは一切関係ありません</li>
                <li>• サイト運営に関するお問い合わせのみ受け付けております</li>
              </ul>
            </div>
          </div>
        </div>

        {/* フッター */}
        <footer className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ホームに戻る
          </Link>
        </footer>
      </div>
    </div>
  );
}
