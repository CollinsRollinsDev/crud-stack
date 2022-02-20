import React, { useState } from 'react'
import styles from './Delete.module.scss';
import Header from './Header';
import moment from 'moment';
import {useRouter} from 'next/router'
// import { v4 as uuidv4 } from 'uuid';

interface Incoming{
  userDetails:any
}

const Delete = ({userDetails}:Incoming) => {
  const router = useRouter()

  const [btn, setBtn] = useState<string>("Delete My Account!")
  const [disabledBtn, setDisabledBtn] = useState(false)

  const handleDelete = async(e:any) => {
    e.preventDefault();
    setDisabledBtn(true)
    // const currentUid = uuidv4()
    const userConfirm = prompt(`You are about to delete your account. Enter ${userDetails.username} to proceed.`)
    if(userConfirm !== userDetails.username){
      alert("Oops! Wrong input!")
      setDisabledBtn(false)
      return;
    }
    const confirmUserRequest = confirm("Are you sure you wish to delete this account. It can't be reversed!")
    if(!confirmUserRequest){
      // do nothing
      alert("We are glad you are still here.")
      setDisabledBtn(false)
      return;
    }
    try {
      setBtn("Deleting...")
      const res = await fetch(`https://crud-stack-server-side.vercel.app/deleteUser`, {
        method:"DELETE",
        body:JSON.stringify({
          id:userDetails?.id,
        }),
        credentials: 'include',
        headers:{
          "content-type":"application/json"
        }
      })
      const {success, message} = await res.json();
      if(success != true){
        setBtn("Delete My Account")
        alert(message)
        setDisabledBtn(false)
        return;
      }
      alert(message)
      router.push('/')
      return;

    } catch (error) {
      setBtn("Delete My Account")
      setDisabledBtn(false)
      alert("Something went wrong!")
        return;
    }

  }

  return (
    <>
    <Header currentPage="delete" />
    <section className={styles.container}>
      <h1>Welcome @{userDetails?.username},</h1>
      <p className={styles.info}>
        Below are your details..
      </p>
      <hr />
      <p className={styles.detail}>Username: <span>{userDetails?.username}</span></p>
      <p className={styles.detail}>Email Address: <span>{userDetails?.emailAddress}</span></p>
      <p className={styles.detail}>Account Created: <span>{moment(userDetails?.createdAt).format('MMMM Do YYYY, h:mm a')}</span></p>

      <button disabled={disabledBtn} onClick={handleDelete}>
        {btn}
      </button>

      </section>
    </>
  )
}

export default Delete