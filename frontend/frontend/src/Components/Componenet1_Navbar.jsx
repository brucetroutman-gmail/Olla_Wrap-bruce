
import React, { PureComponent, useEffect, useState } from 'react';

import ollama from "../assets/ollama.jpg";



export default function Componenet1_Navbar({
  modelList,
  selectedModel,
  setSelectedModel,
  isRecevingMessage
}) {

  const handleSelectModel = (item) => {
    setSelectedModel(item);
  };

  return (
    <div>
      <nav className="navbar shadow-none p-3 mb-5 bg-white rounded navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <div className="container d-flex align-items-center justify-content-between">
            {/* Brand Logo */}
            <a className="navbar-brand  my-0 " href="#"> 
              <img src={ollama} width="30" height="30" className="d-inline-block align-top" alt="" />
              <span className="ms-2 lead"><strong>OllamaWrapper
              </strong></span>
            </a>
            {isRecevingMessage && ( 
              <div class="spinner-grow text-secondary" role="status">
                <span class="visually-hidden">   Loading...</span>
              </div>
            )}

            {/* Dropdown */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                <li className="nav-item dropdown">
                  <a
                    className="dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="h6 text-dark">{selectedModel}</span>
                  </a>
                  <ul className="dropdown-menu">
                    {modelList.map((item, index) => (
                      <li key={index}>
                        <a
                          onClick={() => handleSelectModel(item)}
                          className="dropdown-item text-secondary"
                          href="#"
                        >
                          {item}
                        </a>

                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

