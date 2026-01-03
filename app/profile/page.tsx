import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* ページタイトル */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Profile
          </h1>
          <p className="text-gray-600">プロフィール</p>
        </header>

        {/* プロフィールカード */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 引用元の明記 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 px-6 py-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">出典：</span>
              <a
                href="https://mausu.net/talent/kanno-mai.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                マウスプロモーション公式サイト
              </a>
              より引用
            </p>
          </div>

          {/* 基本情報 */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                菅野 真衣
              </h2>
              <p className="text-xl text-gray-600 mb-4">かんの まい</p>
              <p className="text-lg text-gray-700">Mai Kanno</p>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">誕生日</h3>
                <p className="text-lg text-gray-900">8月14日</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">出身地</h3>
                <p className="text-lg text-gray-900">東京都</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">趣味・特技</h3>
                <p className="text-lg text-gray-900">
                  歌うこと・ピアノ・絶対音感・フリック早打ち・カリンバ
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">経歴</h3>
                <div className="text-gray-900 space-y-2">
                  <p>平成26年：劇団日本児童 退団</p>
                  <p>平成27年：マウスプロモーション附属俳優養成所 入所</p>
                  <p>平成31年：マウスプロモーション 所属</p>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">所属事務所</h3>
                <p className="text-lg text-gray-900">マウスプロモーション</p>
              </div>

              {/* リンク */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">関連リンク</h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://twitter.com/_m_aaii"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                  </a>
                  <a
                    href="https://www.instagram.com/_m_aaii/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 hover:underline"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                  <a
                    href="https://mausu.net/talent/kanno-mai.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:underline"
                  >
                    🏢 事務所公式プロフィール
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 免責事項 */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-2">
              <strong>※ 非公式ファンサイトです</strong>
            </p>
            <p className="text-sm text-gray-600 text-center">
              プロフィール情報は
              <a
                href="https://mausu.net/talent/kanno-mai.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline mx-1"
              >
                マウスプロモーション公式サイト
              </a>
              から引用しています。<br />
              最新・正確な情報は公式サイトをご確認ください。<br />
              所属事務所・ご本人とは一切関係ありません。
            </p>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← ホームに戻る
          </Link>
          <Link
            href="/works"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            出演作品一覧 →
          </Link>
        </div>
      </div>
    </div>
  );
}
