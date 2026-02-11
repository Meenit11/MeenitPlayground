import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function PageContainer({ children }: Props) {
  return (
    <div className="page-root">
      <main className="page-main">{children}</main>
    </div>
  );
}

