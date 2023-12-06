import React from 'react';

function Footer() {
  return (

    <footer className="text-center text-lg-start bg-light text-muted mt-5" >
      <div
        className="text-center border-top p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)"}}
      >
        © 2023 Copyright:
        <a className="text-reset fw-bold" href="https://sa3.com/">
          Sa3
        </a>
      </div>
    </footer>

  );
}

export default Footer;
