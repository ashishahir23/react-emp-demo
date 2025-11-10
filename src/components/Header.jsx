import React, { useState, useRef, useLayoutEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, Tooltip } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useAppDialog, AlertTitle } from "../context/AppDialogContext";
import { MessageText } from "../constants/Messages";

const Header = () => {
    const { user, logout } = useAuth();
    const { showConfirm } = useAppDialog();

    const navigate = useNavigate();
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const hoverTimeout = useRef(null);

    const headerRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);

    if (!user) return null; // hide header when not logged in

    const handleLogout = () => {
        showConfirm({
            title: AlertTitle.LOGOUT_CONFIRMATION,
            message: MessageText.LOGOUT,
            onConfirm: () => { handleLogoutConfirm(); }
        });
    }

    const handleLogoutConfirm = () => {
        logout();
        navigate("/Login/LoginForm");
    };

    // menu data
    const menuItems = [
        {
            label: "Employees",
            path: "/employee/list",
            subItems: [
                { label: "Employee List", path: "/employee/list" },
                { label: "Add Employee", path: "/employee/add" },
            ],
        },
        {
            label: "Departments",
            path: "/department/list",
            subItems: [
                { label: "Department List", path: "/department/list" },
                { label: "Add Department", path: "/department/add" },
            ],
        },
    ];

    // track which main menu is hovered
    const handleMouseEnter = (label) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHoveredMenu(label);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => setHoveredMenu(null), 200); // delay hide
    };

    useLayoutEffect(() => {
        const header = headerRef.current;
        const headerTop = header.offsetTop; // measure position before paint

        const handleScroll = () => {
            // When user scrolls past the header's top offset, make it sticky
            if (window.scrollY > headerTop) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Run once initially to set correct state if user starts mid-scroll
        handleScroll();

        // Cleanup
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <>
            <header
                ref={headerRef}
                className="page-header"
                style={{ position: isSticky ? "fixed" : "static" }}
            >
                {/* Left: App Title */}
                <h3 style={{ margin: 0 }}>Employee Portal</h3>

                {/* Main Menu */}
                <nav className="nav-menu">
                    {menuItems.map((menu) => (
                        <div
                            key={menu.label}
                            style={{ position: "relative", float: "left" }}
                            onMouseEnter={() => handleMouseEnter(menu.label)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <NavLink
                                to={menu.path}
                                className={({ isActive }) => (`nav-menuitem ${isActive ? "nav-menuitem-active" : ""}`)}
                            >
                                {menu.label} ▾
                            </NavLink>

                            {/* Dropdown menu */}
                            {hoveredMenu === menu.label && (
                                <div
                                    onMouseEnter={() => handleMouseEnter(menu.label)} // keep open
                                    onMouseLeave={handleMouseLeave}
                                    className="mouse-hover-menuitem"
                                >
                                    {menu.subItems.map((sub) => (
                                        <NavLink
                                            key={sub.path}
                                            to={sub.path}
                                            className={({ isActive }) => (`nav-sub-menuitem ${isActive ? "nav-sub-menuitem-active" : ""}`)}
                                        >
                                            {sub.label}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right: User info and Logout */}
                <div>
                    <span style={{ marginRight: "12px" }}>
                        👋 Hello, <strong>{user.name}</strong>
                    </span>
                    <Tooltip title="Logout">
                        <IconButton color="error" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </header>

        </>
    );
};

export default Header;
