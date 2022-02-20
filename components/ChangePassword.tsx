import styles from './ChangePassword.module.scss';
import React, {useState, useEffect} from 'react'
import Header from './Header';
import TextField from '@mui/material/TextField';
import { useTheme } from "next-themes";
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

interface Incoming{
  userDetails:any
}

const ChangePassword = ({userDetails}:Incoming) => {
  const router = useRouter()
  const { theme, setTheme } = useTheme();
  const [disabledState, setDisabledState] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<any>('error')
  const [btn, setBtn] = useState<string>("Change Password")
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState("")
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
  if(!confirmPassword || !currentPassword || !password){
    setAlertMsg("Some info are not provided. Please provide all details")
    setSeverity("error")
    setOpen(true)
    setDisabledState(false)
    return;
  }

  if(password !== confirmPassword){
    setAlertMsg("Passwords does not match!")
    setSeverity("error")
    setOpen(true)
    setDisabledState(false)
    return;
  }


  try {
    setBtn("please wait....")
    const res = await fetch(`http://localhost:8088/changepassword`, {
      method:"PATCH",
      body:JSON.stringify({
        id:userDetails?.id,
        username:userDetails?.username,
        oldPassword:currentPassword,
        password
      }),
      credentials: 'include',
      headers:{
        "content-type":"application/json"
      }
    });
    const data = await res.json();
    if(data.success !== true){
      setAlertMsg(data.message)
      setSeverity("error")
      setOpen(true)
      setBtn("Change Password")
      setDisabledState(false)
      return;
    }
    setSeverity("success")
    setAlertMsg(data.message)
    setBtn("Success!")
    setOpen(true)
    window.setTimeout(() => {
      router.push('/')
    }, 2000);
    return;
  } catch (error) {
    setAlertMsg("An error occured! Please try again!")
      setSeverity("error")
      setOpen(true)
      setBtn("Change Password")
      setDisabledState(false)
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
    <Header currentPage="changepassword" />
    
    <div className={styles.alertArea}>
      {displayAlert}
    </div>

    <section className={styles.mainSpilt}>
      <section className={styles.left}>
      <h1>
        Welcome @{userDetails?.username}.
      </h1>
      <p>you can contact Collins Rollins <a style={{color:'blue'}} href="https://collinsrollins.com">here.</a>!</p>
      </section>
      <section className={styles.right}>
        <form noValidate>
          <h2>Fill the form to change your password</h2>

          <TextField
          required
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          id="filled-helperText"
          label="current password"
          variant="standard"
          type="password"
          autoComplete='off'
        />

        <TextField
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          id="filled-helperText"
          label="new password"
          variant="standard"
          type="password"
          autoComplete='off'
        />

          <TextField
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          id="filled-helperText"
          label="confirm password"
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

export default ChangePassword