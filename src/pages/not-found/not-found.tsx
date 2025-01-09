import { Link, useLocation } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function NotFound() {
  const location = useLocation();

  return (
    <section className="flex-1 p-6 grid place-items-center">
      <Card>
        <CardHeader>
          <CardTitle>404 - Página não Encontrada</CardTitle>
          <CardDescription>{`página: ${location.pathname}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Desculpe, não foi possível encontrar a página.</p>
        </CardContent>
        <CardFooter>
          <Link to="/">
            <Button className="transition-all">
              Voltar para a Página Inicial
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}

export { NotFound };
