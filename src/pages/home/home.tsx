import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { componentsConfig } from "@/config/components";

type HomeItemProps = {
  to: string;
  title: string;
};

function HomeItem({ to, title }: HomeItemProps) {
  return (
    <Link to={to} state={{ title }} className="h-min">
      <Button variant="secondary">{title}</Button>
    </Link>
  );
}

function Home() {
  return (
    <section className="flex-1 flex px-6 pb-6">
      <Card className="flex-1 grid grid-cols-5 gap-4 p-6">
        {componentsConfig.map(({ id, to, title }) => (
          <HomeItem key={id} to={to} title={title} />
        ))}
      </Card>
    </section>
  );
}

export { Home };
