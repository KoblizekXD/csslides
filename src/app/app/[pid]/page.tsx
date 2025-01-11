import App from "./app";

export default async function Page({
  params,
}: {
  params: Promise<{ pid: string }>
}) {
  return <App id={(await params).pid} />;
}
