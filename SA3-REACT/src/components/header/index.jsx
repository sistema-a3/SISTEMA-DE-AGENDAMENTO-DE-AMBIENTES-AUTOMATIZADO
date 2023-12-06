import React, { useEffect } from 'react';
import logo from "../../img/svg/logo.svg";
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const UserSession = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        if (!UserSession) {
            localStorage.removeItem("user");
            navigate("/")
        }
    }, [UserSession, navigate])

    function logout() {
        localStorage.removeItem("user");
        navigate("/")
    };

    function handleNavigate() {
        if (UserSession && UserSession.tipo === 0) {
            navigate("/homeadm");
        } else if (UserSession && UserSession.tipo === 1) {
            navigate("/homeuser");
        } else {
            navigate('/');
        }
    }

    return (

        <nav className="navbar navbar-light bg-light nav nav-pills nav-fill">
            <div className="container">
                <div className="col-4">
                    {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="navbar-brand" href='' onClick={handleNavigate}>
                        <img src={logo} alt="" width={40} />
                    </a>
                </div>
                <div className="col-8 d-flex justify-content-end">

                    <div className="dropdown">
                        <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton2"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi-person-fill me-2">
                                
                             </i>

                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                            <li>
                                <a className="dropdown-item" href="/profileUser">
                                    Editar Perfil
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a className="dropdown-item" href="#" onClick={logout}>
                                    Sair
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </nav >

    );
}

export default Header
