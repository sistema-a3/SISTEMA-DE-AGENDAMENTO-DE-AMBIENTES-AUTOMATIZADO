import React from "react";

import './index.css'

function ButtonActive(props) {

    const classbtn = ["btn", "bg-active"];
    const classes = `${classbtn} ${props.classesAdicionais || ''}`
    return (
        <div class={classes} id="">
            Cadastrar
        </div>
    );
}

export default ButtonActive;
