import React, {useState, useEffect} from 'react'
import Header from './Header';
import styles from './Register.module.scss';
import TextField from '@mui/material/TextField';
import { useTheme } from "next-themes";
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { FlashlightOffTwoTone } from '@mui/icons-material';


const Register = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme();
  const [disabledState, setDisabledState] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<any>('error')
  const [btn, setBtn] = useState<string>("Register now.")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [alertMsg, setAlertMsg] = useState('')


  const displayAlert = <Box sx={{ width: '100%' }}>
  <Collapse in={open}>
    <Alert severity={severity}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setOpen(false);
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
      sx={{ mb: 2 }}
    >
      {alertMsg}
    </Alert>
  </Collapse>
</Box>


const handleSubmit = async(e:any) => {
  e.preventDefault();
  setOpen(false)
  setDisabledState(true)
  if(!username || !email || !password || !confirmPassword){
    setAlertMsg("Some info are not provided. Please provide all details")
    setSeverity("error")
    setOpen(true)
    setDisabledState(false)
    return;
  }

     const validateEmail = async() => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(regexEmail)) {
      // do nothing
      return true
    } else {
      setAlertMsg("You provided an invalid email format")
      setSeverity("error")
      setOpen(true)
      return false;
    }
  }
  const break_off = await validateEmail()
  if(break_off !== true){
    setBtn("Register now")
    setDisabledState(false)
    return;
  }
  if(password !== confirmPassword){
    setAlertMsg("Sorry, your password does not match. Please check and try again")
    setSeverity("error")
    setOpen(true)
    setDisabledState(false)
    return;
  }

  try {
    setBtn("Registering...")
    const res = await fetch(`https://crud-stack-server-side.vercel.app/signup`, {
      method:"POST",
      body:JSON.stringify({
        username:username.toLocaleLowerCase(),
        emailAddress:email.toLocaleLowerCase(),
        password
      }),
      headers:{
        "content-type":"application/json"
      }
    });
    const data = await res.json();
    if(data.stats !== "success"){
      setAlertMsg(data.reason)
      setSeverity("error")
      setOpen(true)
      setBtn("Register now")
      setDisabledState(false)
      return;
    }
    setAlertMsg(data.reason)
    setSeverity("success")
    setBtn("Success!")
    setOpen(true)
    window.setTimeout(() => {
      router.push('/login')
    }, 2000);
    return;
  } catch (error) {
    setAlertMsg("An error occured! Please try again!")
      setSeverity("error")
      setDisabledState(false)
      setOpen(true)
      setBtn("Register now")
      return;
  }

}

useEffect(() => {
  const x = window.setInterval(() => {
    console.log("counting...")
    if(open){
      setOpen(false)
    }
  }, 10000)
  return () => {
    x
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])




  return (
    <>
    <Header currentPage="register" />
    
    <div className={styles.alertArea}>
      {displayAlert}
    </div>

    <section className={styles.mainSpilt}>
      <section className={styles.left}>
      <h1>
        Welcome, Sign up here....
      </h1>
      <p>Feel free, your password are encrypted!</p>
      </section>
      <section className={styles.right}>
        <form noValidate>
          <h2>Fill the details below to register</h2>
          <TextField
          required
          value={username.toLocaleLowerCase()}
          onChange={e => setUsername(e.target.value)}
          id="filled-helperText"
          label="Username"
          variant="standard"
          type="text"
          autoComplete='off'
          // color="none"
        />

        <TextField
          required
          value={email.toLocaleLowerCase()}
          onChange={e => setEmail(e.target.value)}
          id="filled-helperText"
          label="email"
          variant="standard"
          type="email"
          autoComplete='off'
        />

          <TextField
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          id="filled-helperText"
          label="Password"
          variant="standard"
          helperText="passwords are encrypted"
          type="password"
          autoComplete='off'
        />
         <TextField
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          id="filled-helperText"
          label="Confirm password"
          variant="standard"
          helperText="passwords are encrypted"
          type="password"
          autoComplete='off'
        />
        <button onClick={handleSubmit} disabled={disabledState}>
          {btn}
        </button>
        </form>
      </section>
    </section>
    </>

  )
}

export default Register