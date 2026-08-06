import { Router } from "express";

import autorRoutes from "../autor/autorRoutes";
import livroRoutes from "../livro/livroRoutes";
import usuarioRoutes from "../usuario/usuarioRoutes";
import emprestimoRoutes from "../emprestimo/emprestimoRoutes";

const routes = Router();

routes.use("/autores", autorRoutes);
routes.use("/livros", livroRoutes);
routes.use("/usuarios", usuarioRoutes);
routes.use("/emprestimos", emprestimoRoutes);

export default routes;