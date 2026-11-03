import { Router } from "express";

import autorRoutes from "../autor/autorRoutes";
import livroRoutes from "../livro/livroRoutes";
import usuarioRoutes from "../usuario/usuarioRoutes";
import emprestimoRoutes from "../emprestimo/emprestimoRoutes";
import contaRoutes from "../conta/contaRoutes";
import categoriaRoutes from "../categoria/categoriaRoutes";
import leitorRoutes from "../leitor/leitorRoutes";

const routes = Router();

routes.use("/autores", autorRoutes);
routes.use("/livros", livroRoutes);
routes.use("/usuarios", usuarioRoutes);
routes.use("/emprestimos", emprestimoRoutes);
routes.use("/contas", contaRoutes);
routes.use("/categorias", categoriaRoutes);
routes.use("/leitores", leitorRoutes);

export default routes;