import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/home/index";
import HomeAdm from "./pages/adm/homeAdm";
import HomeUser from "./pages/user/homeUser";
import CadSala from "./pages/adm/cadSala/index";
import CadSetor from "./pages/adm/cadSetor/index";
import CadSolicitacao from "./pages/adm/cadSolicitacao/index";
import CadUsuario from "./pages/adm/CadUsuario/index";
import AgendaVazia from "./pages/agenda/agendaVazia";
import ProfileUser from "./pages/user/profileUser"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/homeadm" element={<HomeAdm />} />
                <Route path="/homeuser" element={<HomeUser />} />
                <Route path="/cadsala" element={<CadSala />} />
                <Route path="/cadsetor" element={<CadSetor />} />
                <Route path="/cadsolicitacao" element={<CadSolicitacao />} />
                <Route path="/cadusuario" element={<CadUsuario />} />
                <Route path="/agenda" element={<AgendaVazia />} />
                <Route path="/profileUser" element={<ProfileUser />} />


                
            </Routes>
        </BrowserRouter>
    );
}

export default App;
