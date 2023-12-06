import React, { useEffect } from 'react';
import Logo from "../../img/svg/logo.svg";
import { useNavigate } from 'react-router-dom';

const HeaderAdm = () => {
    const UserSession = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate();
    useEffect(() => {
        if (!UserSession) {
            navigate("/");
        } else if (UserSession.tipo !== 0) {
            navigate("/homeuser");
        }
    }, [UserSession, navigate])

    function logout() {
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <>
            <div className="sidebar">

                <div className="item "  >
                    {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a>
                        <div className="icon ">
                            {/*  */}
                            <i className="fa-solid fa-house fa-xl"></i>
                        </div>
                    </a>
                    <div className="text " >Inicio</div>
                </div>
                <div className="item" onClick={() => { navigate('/agenda') }}>
                    {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="icon">
                        <i className="fa-solid fa-calendar-days fa-2xl"></i>
                    </a>
                    <div className="text">Agendamento</div>
                </div>

                <div className="item" id="item-end">
                    {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#" className="icon">
                        <i className="fa-solid fa-arrow-right-from-bracket fa-2xl"></i>
                    </a>
                    <div className="text" onClick={() => logout()}>Sair</div>
                </div>
            </div>
            <div className="sidebar">
                <div className="item">
                    {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#" onClick={() => navigate("/homeadm")}>
                        <img
                            src={Logo}
                            alt=""
                            className="icon"

                            style={{
                                width: 30, // 30 pixels
                                height: 30, // 30 pixels
                            }}
                        />
                    </a>
                    <div className="text">SA3</div>
                </div>
                <hr />
                <div className="item">
                    <a href="/homeadm" onClick={() => navigate("/homeadm")}>
                        <div className="icon">
                            {/*  */}
                            <i className="fa-solid fa-house fa-xl"></i>
                        </div>
                    </a>
                    <div className="text">Inicio</div>
                </div>
                <div className="item">
                    <a href={"/agenda"} className="icon" onClick={() => navigate("/agenda")}>
                        <i className="fa-solid fa-calendar-days fa-2xl"></i>
                    </a>
                    <div className="text">Agendamento</div>
                </div>

                <div className="item" id="item-end" onClick={logout}>
                    {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="icon">
                        <i className="fa-solid fa-arrow-right-from-bracket fa-2xl"></i>
                    </a>

                    <div className="text" >Sair</div>
                </div>
            </div>
        </>
    );
}



export default HeaderAdm;
