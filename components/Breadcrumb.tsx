import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // 構造化データの生成
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://mai-kanno-fansite.net',
      },
      ...items.slice(0, -1).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: `https://mai-kanno-fansite.net${item.href}`,
      })),
      {
        '@type': 'ListItem',
        position: items.length + 1,
        name: items[items.length - 1].label,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="パンくずリスト" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <li>
            <Link
              href="/"
              className="hover:text-pink-600 transition-colors"
            >
              ホーム
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-pink-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
