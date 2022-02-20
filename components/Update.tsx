import styles from './Update.module.scss';
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

const Update = ({userDetails}:Incoming) => {
  const router = useRouter()
  const { theme, setTheme } = useTheme();
  const [disabledState, setDisabledState] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<any>('error')
  const [btn, setBtn] = useState<string>("Update")
  const [email, setEmail] = useState(userDetails?.emailAddress)
  const [username, setUsername] = useState(userDetails?.username)
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
  if((!email && !username) || !password){
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
      return false;
    }
  }
  const break_off = await validateEmail()
  let queryP = "email";
  if(break_off !== true){
    queryP = ''
  }


  try {
    setBtn("please wait....")
    const res = await fetch(`http://localhost:8088/updateuser?queryP=${queryP}`, {
      method:"PATCH",
      body:JSON.stringify({
        id:userDetails?.id,
        username:username.toLocaleLowerCase(),
        emailAddress:email.toLocaleLowerCase(),
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
      setBtn("Update")
      setDisabledState(false)
      return;
    }
    setAlertMsg(data.message)
    setSeverity("success")
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
      setBtn("Update")
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
    <Header currentPage="update" />
    
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
          <h2>Fill the form to login</h2>

          <TextField
          required
          value={username && username.toLocaleLowerCase()}
          onChange={e => setUsername(e.target.value)}
          id="filled-helperText"
          label="username"
          variant="standard"
          type="text"
          autoComplete='off'
        />

        <TextField
          required
          value={email && email.toLocaleLowerCase()}
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
        <button onClick={handleSubmit} disabled={disabledState}>
          {btn}
        </button>
        </form>
      </section>
    </section>
    </>

  )
}

export default Update