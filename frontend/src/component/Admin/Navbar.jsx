import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, IconButton } from "@material-ui/core";
// Ensure you are using the correct Icon import for MUI v4
import MenuIcon from "@material-ui/icons/Menu"; 
import { Link } from "react-router-dom";

// Standard import for Vite - do NOT use require()
import LogoImg from "../../Image/logo.png"; 

const useStyles = makeStyles((theme) => ({
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff",
    padding: "0.8rem 2rem",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 999,
    width: "100%",
  },
  menuIcon: {
    display: "none",
    // Fix: Using numeric breakpoint for custom 999px width
    [theme.breakpoints.down(999)]: {
      display: "block",
    },
    "&:hover": {
      color: "#ed1c24",
    },
  },
  logoContainer: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down(999)]: {
      justifyContent: "center",
    },
  },
  logoMain: {
    height: "3rem",
    width: "auto",
    display: "block",
  },
  contactButton: {
    background: "#414141",
    color: "#fff",
    borderRadius: "20px",
    textTransform: "none",
    fontWeight: 600,
    padding: "8px 24px",
    "&:hover": { 
      background: "#ed1c24",
    },
    // Hide contact button on small mobile screens
    [theme.breakpoints.down("xs")]: { 
      display: "none",
    },
  },
}));

const Navbar = ({ toggleHandler }) => {
  const classes = useStyles();

  return (
    <nav className={classes.navbar}>
      <IconButton className={classes.menuIcon} onClick={toggleHandler}>
        <MenuIcon style={{ fontSize: "2rem" }} />
      </IconButton>

      <div className={classes.logoContainer}>
        <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
          <img 
            src={LogoImg} 
            alt="Cricket Weapon Store" 
            className={classes.logoMain} 
          />
        </Link>
      </div>

      <Link to="/contact" style={{ textDecoration: "none" }}>
        <Button variant="contained" className={classes.contactButton}>
          Contact Us
        </Button>
      </Link>
    </nav>
  );
};

export default Navbar;