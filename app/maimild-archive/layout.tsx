import Script from 'next/script';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: () => void;
      };
    };
  }
}

export const dynamic = 'force-dynamic';

export default function MyMailArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.twttr?.widgets?.load) {
            window.twttr.widgets.load();
          }
        }}
      />
    </>
  );
}
