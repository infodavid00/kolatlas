
import { useState, useEffect } from 'react'
import '../index.css'
import { Send } from 'react-feather'
import { TailSpin } from 'react-loader-spinner'
import { useParams } from 'react-router-dom'
import { baseEndpoint } from '../var.jsx'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


dayjs.extend(relativeTime);

export default function Overview() {
  const [user, setUser] = useState(false)
  const { id } = useParams()
  
  useEffect(()=> {
     async function fetchData() {
  	   try {
        const response = await fetch(`${baseEndpoint}/records/readOne?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Srt': 'main',
          },
        });
        if (response.status === 200) {
          const data = await response.json()
          setUser(data.data)
        } else if (response.status === 404) {
          setUser('n')
        } else {
          throw new Error('Submission failed');
        }
       } catch (error) {
        console.error(error);
       } 
      }
     fetchData()
  }, [])

  const [commentInput, setCommentInput] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const handleCommentUpload = async (id) => {
  	 setIsCommenting(true)
  	 try {
  	    const date = new Date()
        const response = await fetch(`${baseEndpoint}/records/writeComment?id=${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Srt': 'main',
          },
          body: JSON.stringify({
          	 text: commentInput,
          	 date
          })
        });	
        if (response.status === 200) {
        	window.location.reload()
        } else throw { message: null}
  	 } catch(e) {
  	   console.log(e.message)
  	 } finally {
   	   setIsCommenting(false)
  	 }
  }

  const [isShowingDelete, setIsShowingDelete] = useState(false)
  const [isOnEditing, setIsOnEditing] = useState(false)
  const [isOnEditingUCC, setIsEditingOnUCC] = useState(true)
  const [isOnDeletingUCC, setIsOnDeletingUCC] = useState(true)

  const handleKeyDown = (event) => {
    if (event.ctrlKey && (event.key === 'x' || event.key === 'X')) {
       setIsOnUploader(true);
    }
    if (event.ctrlKey && (event.key === '2')) {
       event.preventDefault();
       setIsOnEditing(true);
       setUccElementEditIndex(0); 
       setNotUccElementEditIndex(0); 
    }
    if (event.ctrlKey && (event.key === '1')) {
       event.preventDefault();
       setIsShowingDelete(true);
       //setUccElementEditIndex(0); 
       //setNotUccElementEditIndex(0); 
    }
 };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const [isOnUploader, setIsOnUploader] = useState(false)
  const [isOnUCC, setIsOnUCC] = useState(true)

  const [UCCInputs, setUCCInputs] = useState({
  	 password: '',
  	 token: '',
  	 chain: [],
  	 ca: '',
  	 link: '',
  	 doic: '',
  	 pac: '',
  	 cc: '',
  	 date: new Date()
  })
  const setUUCInputs = (key, value) => {
  	const N = {...UCCInputs}
  	N[key] = value
  	setUCCInputs(N)
  }
  const [onSubmitingUCC, setOnSubmitUCC] = useState(false)
  const handleUUCUpload = async () => {
  	if (UCCInputs.password && 
  	   UCCInputs.token && 
  	   UCCInputs.chain && 
  	   UCCInputs.ca && 
  	   UCCInputs.link &&
  	   UCCInputs.doic && 
  	   UCCInputs.pac &&
  	   UCCInputs.cc) {
  	      setOnSubmitUCC(true)
  	      const UCCinputTosumbit = {...UCCInputs}
  	      delete UCCinputTosumbit.password
  	   	  try {
             const response = await fetch(`${baseEndpoint}/records/writeCurrentCalls?id=${id}`, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
                 'X-Srt': 'main',
                 'X-application-password': UCCInputs.password
               },
               body: JSON.stringify(UCCinputTosumbit) 
             });
             if (response.ok) {
               setIsOnUploader(false);
               window.location.reload();
             } else {
               throw new Error('Submission failed');
             }
          } catch (error) {
            console.error(error);
          } finally {
            setOnSubmitUCC(false);
          }
  	   }
  }

  const [notUCCInputs, setNotUCCInputs] = useState({
  	 password: '',
  	 token: '',
  	 chain: [],
  	 ca: '',
  	 link: '',
  	 doic: '',
  	 pac: '',
  	 cc: '',
  	 fdperf: '',
  	 fwperf: '',
  	 fmperf: '',
  	 date: new Date()
  })
  const setNotUUCInputs = (key, value) => {
  	const N = {...notUCCInputs}
  	N[key] = value
  	setNotUCCInputs(N)
  }
  const [onSubmitingNotUCC, setOnSubmitNotUCC] = useState(false)
  const handleNotUUCUpload = async () => {
  	if (notUCCInputs.password && 
  	   notUCCInputs.token && 
  	   notUCCInputs.chain && 
  	   notUCCInputs.ca && 
  	   notUCCInputs.link &&
  	   notUCCInputs.doic && 
  	   notUCCInputs.pac &&
  	   notUCCInputs.cc &&
  	   notUCCInputs.fdperf &&
  	   notUCCInputs.fwperf &&
  	   notUCCInputs.fmperf) {
  	      setOnSubmitNotUCC(true)
  	      const notUCCinputTosumbit = {...notUCCInputs}
  	      delete notUCCinputTosumbit.password
  	   	  try {
             const response = await fetch(`${baseEndpoint}/records/writeHistory?id=${id}`, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
                 'X-Srt': 'main',
                 'X-application-password': notUCCInputs.password
               },
               body: JSON.stringify(notUCCinputTosumbit) 
             });
             if (response.ok) {
               setIsOnUploader(false);
               window.location.reload();
             } else {
               throw new Error('Submission failed');
             }
          } catch (error) {
            console.error(error);
          } finally {
            setOnSubmitNotUCC(false);
          }
  	  }
  }


  const [notuccElementEditIndex, setNotUccElementEditIndex] = useState(0)
  const [notuccElementEdit, setNotUccElementEdit] =  
        useState(typeof user === "object" && user?.history ?  user?.history[0] : {})

  const [uccElementEditIndex, setUccElementEditIndex] = useState(0)
  const [uccElementEdit, setUccElementEdit] =  
        useState(typeof user === "object" && user?.currentCallsList ?  user?.currentCallsList[0] : {})
  
  useEffect(() => {
    if (typeof user === "object" && user?.currentCallsList) {
       setUccElementEdit(user.currentCallsList[uccElementEditIndex]);
    }
  }, [uccElementEditIndex]);

  useEffect(() => {
    if (typeof user === "object" && user?.history) {
       setNotUccElementEdit(user.history[notuccElementEditIndex]);
    }
  }, [notuccElementEditIndex]);

 
  useEffect(() => {
    if (typeof user === "object" && user?.currentCallsList && uccElementEditIndex === 0) {
       setUccElementEdit(user.currentCallsList[0]);
    }
    if (typeof user === "object" && user?.history && notuccElementEditIndex === 0) {
       setNotUccElementEdit(user.history[0]);
    }
  }, [user]);
  const [editPassword, setEditPassword] = useState('')
  
const setUccElementEditInputs = (key, value) => {
    const N = { ...uccElementEdit }; // Fix: spread uccElementEdit
    N[key] = value;
    setUccElementEdit(N);
};

const setNotUccElementEditInputs = (key, value) => {
    const N = { ...notuccElementEdit }; // Fix: spread notuccElementEdit
    N[key] = value;
    setNotUccElementEdit(N);
};

  const [isEditingCurrentCalls, setisEditingCurrentCalls] = useState(false)   
  const [isEditingHistory, setisEditingHistory] = useState(false)
    
  const handleCurrentCallsEditUpload = async () => {
  	try {      
  	  setisEditingCurrentCalls(true)
  	  const ccl = {currentCallsList: [...user?.currentCallsList]}
  	  ccl.currentCallsList[uccElementEditIndex] = uccElementEdit
      const makerequest = await fetch(`${baseEndpoint}/records/edit?id=${id}`, {
         method: 'PUT',
         headers: { 
            'X-Srt': 'main',               	 
            'X-application-password': editPassword,
            'Content-Type': 'application/json',
            
         },
         body: JSON.stringify(ccl)
      });
      if (makerequest.ok) {
          window.location.reload()
      } else {
         throw { message: null}
      }
    } catch (error) {
      console.error(error);
      setisEditingCurrentCalls(false);
      return; 
    }
  }

  const handleHistoryEditUpload = async () => {
  	try {    
  	  setisEditingHistory(true)
  	  const ch = {history: [...user?.history]}
  	  console.log(user.history, notuccElementEdit)
  	  ch.history[notuccElementEditIndex] = notuccElementEdit
      const makerequest = await fetch(`${baseEndpoint}/records/edit?id=${id}`, {
         method: 'PUT',
         headers: { 
            'X-Srt': 'main',               	 
            'X-application-password': editPassword,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(ch)
      });
      if (makerequest.ok) {
          window.location.reload()
      } else {
         throw { message: null}
      }
    } catch (error) {
      console.error(error);
      setisEditingHistory(false);
      return; 
    }
  }


  
  const [notuccElementDeleteIndex, setNotUccElementDeleteIndex] = useState(0)
  const [uccElementDeleteIndex, setUccElementDeleteIndex] = useState(0)

  const [isDeletingCurrentCalls, setisDeletingCurrentCalls] = useState(false)
  const [isDeletingHistory, setisDeletingHistory] = useState(false)

  async function handleCurrentCallsDelete() {
     const newOne = { currentCallsList:
        user.currentCallsList.filter((e, index) => e.token  !==  user.currentCallsList[uccElementDeleteIndex].token) 
     }
     setisDeletingCurrentCalls(true)
  	 try {    
      const makerequest = await fetch(`${baseEndpoint}/records/edit?id=${id}`, {
         method: 'PUT',
         headers: { 
            'X-Srt': 'main',               	 
            'X-application-password': editPassword,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(newOne)
      });
      if (makerequest.ok) {
          window.location.reload()
      } else {
         throw { message: null}
      }
     } catch (error) {
      console.error(error);
      setisDeletingCurrentCalls(false);
      return; 
     }
  }
  
  async function handleHistoryDelete() {
     const newOne = { history:
        user.history.filter((e, index) => e.token  !==  user.history[notuccElementDeleteIndex].token) 
     }
     setisDeletingHistory(true)    
  	 try {    
      const makerequest = await fetch(`${baseEndpoint}/records/edit?id=${id}`, {
         method: 'PUT',
         headers: { 
            'X-Srt': 'main',               	 
            'X-application-password': editPassword,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(newOne)
      });
      if (makerequest.ok) {
          window.location.reload()
      } else {
         throw { message: null}
      }
     } catch (error) {
      console.error(error);
      setisDeletingHistory(false);
      return; 
     }
  }

  function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
          toast.success('copied to clipboard!');
      }).catch(err => {
          toast.success('Failed to copy');
      });
  }


   const handleChainsUccElementEditInput = (val) => {
     const newelementToUpdate = {...uccElementEdit}
     let chain = uccElementEdit.chain
     const chf = chain.find(e => e.includes(val))
     if (chf) {
        chain = chain.filter(e => !e.includes(val))
     } else {
     	chain.push(val)
     }
     setUccElementEdit({...newelementToUpdate, chain: chain})
  };

   const handleChainsNotUccElementEditInput = (val) => {
     const newelementToUpdate = {...notuccElementEdit}
     let chain = notuccElementEdit.chain
     const chf = chain.find(e => e.includes(val))
     if (chf) {
        chain = chain.filter(e => !e.includes(val))
     } else {
     	chain.push(val)
     }
     setNotUccElementEdit({...notuccElementEdit, chain: chain})
  };


   const handleChainsUccInput = (val) => {
     const newelementToUpdate = {...UCCInputs}
     let chain = UCCInputs.chain
     const chf = chain.find(e => e.includes(val))
     if (chf) {
        chain = chain.filter(e => !e.includes(val))
     } else {
     	chain.push(val)
     }
     setUCCInputs({...newelementToUpdate, chain: chain})
  };

   const handleChainsNotUccInput = (val) => {
     const newelementToUpdate = {...notUCCInputs}
     let chain = notUCCInputs.chain
     const chf = chain.find(e => e.includes(val))
     if (chf) {
        chain = chain.filter(e => !e.includes(val))
     } else {
     	chain.push(val)
     }
     setNotUCCInputs({...newelementToUpdate, chain: chain})
  };


  
  return (
    <>
    {typeof user === 'object' && user?._id ? (
  	 <div id='overview'> 
  	    <div id='overview-a'>
  	       <div className='overview-header'>KOL Profile</div>
  	       <div id='oa-metadata'>  
  	         <img id='oa-metadata-profile' src={user.image} />
  	         <div>  
  	            <div className='oa-metadata-text' style={{ fontFamily: 'poppins' }}>{user.name}</div>
  	            <a className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.x}>{user.x}</a>
  	            <a className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.tg}>{user.tg}</a>
  	            <div className='oa-metadata-text'>{(user?.chains ?? []).join(', ')}</div>
  	            <div className='oa-metadata-text'>Score: {user.votes}</div>
  	         </div>
  	       </div>
           <br />
  	       <div className='overview-header'>Current Calls</div>

           <div id='table-patcher'>
  	       <table id='home-table'>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Chain</th>
                  <th>CA</th>
                  <th>Link</th>
                  <th>Date of Initial Call</th>
                  <th>Price at call</th>
                  <th>Current Price</th>
                  <th>% Performance</th>
                </tr>
              </thead>                         
              <tbody>
                {(user?.currentCallsList?.sort((a, b) => new Date(b.date) - new Date(a.date)) ?? []).map((list, index) => (
                  <tr key={index} className='home-table-databody'>
                    <td className='home-table-data'>{list.token}</td>
                    <td className='home-table-data'>{(list?.chain ?? []).join(', ')}</td>
                    <td className='home-table-data' onClick={()=> copyToClipboard(list.ca)} style={{ cursor: 'pointer', color: 'dodgerblue'}}>
                       {list.ca.slice(0, 3)}...{list.ca.slice(list.ca.length - 3)}</td>
                    <td className='home-table-data'><a href={list.link}>{list.link}</a></td>
                    <td className='home-table-data'>{list.doic}</td>
                    <td className='home-table-data'>${list.pac}</td>
                    <td className='home-table-data'>${list.cc}</td>
                    <td className='home-table-data'>
                       {((Number(list.cc) / Number(list.pac)) - 1).toFixed(2) }%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

           <div className='overview-header'>History</div>

           <div id='table-patcher'>
  	       <table id='home-table'>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Chain</th>
                  <th>CA</th>
                  <th>Link</th>
                  <th>Date of Initial Call</th>
                  <th>Price at call</th>
                  <th>Current Call</th>
                  <th>1d performance</th>
                  <th>1w performance</th>
                  <th>1m performance</th>
                  {/*<th>% Performance</th>*/}
                </tr>
              </thead>                         
              <tbody>
                {(user?.history?.sort((a, b) => new Date(b.date) - new Date(a.date)) ?? []).map((list, index) => (
                  <tr key={index} className='home-table-databody'>
                    <td className='home-table-data'>{list.token}</td>
                    <td className='home-table-data'>{(list?.chain ?? []).join(', ')}</td>
                    <td className='home-table-data' onClick={()=> copyToClipboard(list.ca)} style={{ cursor: 'pointer', color: 'dodgerblue'}}>
                       {list.ca.slice(0, 3)}...{list.ca.slice(list.ca.length - 3)}</td>
                    <td className='home-table-data'><a href={list.link}>{list.link}</a></td>
                    <td className='home-table-data'>{list.doic}</td>
                    <td className='home-table-data'>${list.pac}</td>
                    <td className='home-table-data' onClick={()=> copyToClipboard(list.cc)} style={{ cursor: 'pointer', color: 'dodgerblue'}}>{list.cc}</td>
                    <td className='home-table-data'>{list.fdperf}%</td>
                    <td className='home-table-data'>{list.fwperf}%</td>
                    <td className='home-table-data'>{list.fmperf}%</td>
                    {/*<td className='home-table-data'>
                       {((Number(list.cc) / Number(list.pac)) - 1).toFixed(2) }%</td>
                    */}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
  	    </div>
        <div id='overview-b'>
           <div className='overview-header'>{(user?.comments ?? []).length} Comments</div>
           <div id='ob-comment-s-cont'>
             <textarea placeholder='New comment' value={commentInput} onChange={e => setCommentInput(e.target.value)}></textarea>
             {!isCommenting? <Send strokeWidth={1} style={{ cursor: 'pointer'}} onClick={async ()=> {
             	if (commentInput) {
             	  await handleCommentUpload(user._id)
             	}
             }} />
             : <TailSpin width={20} height={20} color={'blue'} />}
           </div>
           <div id='ob-comment-body'>
             {(user?.comments?.sort((a, b) => new Date(b.date) - new Date(a.date)) ?? []).map((element)=> (
             	<div className='ob-comment'>
             	  <div><div className='ob-comment-logo'>{((element.text ?? '').split('')[0])?.toUpperCase()}</div></div>
             	  <div>
             	    <div className='ob-comment-txt'>{element.text}</div>
             	    <div className='ob-comment-time'>{dayjs(element.date).fromNow()}</div>
             	  </div>
             	</div>
             ))}
           </div>
        </div>
  	 </div>
  	 ) : user === 'n' ? (
  	   <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4em' }}>
          the request resource does not exist
  	   </div> 	 	
  	 ) : (
  	   <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4em' }}>
          <TailSpin width={20} height={20} color={'blue'} />
  	   </div> 
  	 )}

  	 {isOnUploader && user &&
  	   <div id='tint'>
  	     <div id='home-upload-cont'>
  	        <div style={{ fontFamily: 'poppins' }}>Update Record</div>
  	        <div id='overview-upload-pick-cont'>  
  	           <div className={isOnUCC ? 'overview-upload-pick overview-upload-pick-active' : 'overview-upload-pick'} onClick={()=> {
  	           	 if (!isOnUCC) setIsOnUCC(true)
  	           }}>Update Current Calls</div>
  	           <div className={!isOnUCC ? 'overview-upload-pick overview-upload-pick-active' : 'overview-upload-pick'} onClick={()=> {
  	           	 if (isOnUCC) setIsOnUCC(false)
  	           }}>Update History</div>
  	        </div>
  	        {isOnUCC ? (
  	           <>
  	            <input type='text' name='name' value={UCCInputs.password} onChange={e => setUUCInputs('password', e.target.value)} className='home-uploader-input' placeholder='Password' />
  	            <input type='text' name='name' value={UCCInputs.token} onChange={e => setUUCInputs('token', e.target.value)} className='home-uploader-input' placeholder='Token' />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={UCCInputs.chain.includes('ETH')}
                      onChange={() => handleChainsUccInput('ETH')} /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={UCCInputs.chain.includes('BTC')}
                      onChange={() =>  handleChainsUccInput('BTC') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={UCCInputs.chain.includes('SOL')}
                      onChange={() => handleChainsUccInput('SOL') } /></div>  
                                          
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={UCCInputs.chain.includes('BNB')}
                      onChange={() => handleChainsUccInput('BNB') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox'checked={UCCInputs.chain.includes('OTHERS')}
                       onChange={() => handleChainsUccInput('OTHERS') } /></div>
                </div> 
  	            <input type='text' name='name' value={UCCInputs.ca} onChange={e => setUUCInputs('ca', e.target.value)} className='home-uploader-input' placeholder='CA' />
  	            <input type='text' name='name' value={UCCInputs.link} onChange={e => setUUCInputs('link', e.target.value)} className='home-uploader-input' placeholder='Link' />
  	            <input type='text' name='name' value={UCCInputs.doic} onChange={e => setUUCInputs('doic', e.target.value)} className='home-uploader-input' placeholder='Date of Initial Call' />
  	            <input type='text' name='name' value={UCCInputs.pac} onChange={e => setUUCInputs('pac', e.target.value)} className='home-uploader-input' placeholder='Price at call' />
  	            <input type='text' name='name' value={UCCInputs.cc} onChange={e => setUUCInputs('cc', e.target.value)} className='home-uploader-input' placeholder='Current price' />
                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsOnUploader(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={onSubmitingUCC} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleUUCUpload()}>
                    {onSubmitingUCC ? <TailSpin width={20} height={20} color={'white'} /> : 'Upload'}
                  </button>
                </div>
  	           </> 
  	        ) : (
  	          <>
  	            <input type='text' name='name' value={notUCCInputs.password} onChange={e => setNotUUCInputs('password', e.target.value)} className='home-uploader-input' placeholder='Password' />
  	            <input type='text' name='name' value={notUCCInputs.token} onChange={e => setNotUUCInputs('token', e.target.value)} className='home-uploader-input' placeholder='Token' />

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={notUCCInputs.chain.includes('ETH')}
                      onChange={() => handleChainsNotUccInput('ETH')} /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={notUCCInputs.chain.includes('BTC')}
                      onChange={() =>  handleChainsNotUccInput('BTC') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={notUCCInputs.chain.includes('SOL')}
                      onChange={() => handleChainsNotUccInput('SOL') } /></div>  
                                          
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={notUCCInputs.chain.includes('BNB')}
                      onChange={() => handleChainsNotUccInput('BNB') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox'checked={notUCCInputs.chain.includes('OTHERS')}
                       onChange={() => handleChainsNotUccInput('OTHERS') } /></div>
                </div> 
  	            <input type='text' name='name' value={notUCCInputs.ca} onChange={e => setNotUUCInputs('ca', e.target.value)} className='home-uploader-input' placeholder='CA' />
  	            <input type='text' name='name' value={notUCCInputs.link} onChange={e => setNotUUCInputs('link', e.target.value)} className='home-uploader-input' placeholder='Link' />
  	            <input type='text' name='name' value={notUCCInputs.doic} onChange={e => setNotUUCInputs('doic', e.target.value)} className='home-uploader-input' placeholder='Date of Initial Call' />
  	            <input type='text' name='name' value={notUCCInputs.pac} onChange={e => setNotUUCInputs('pac', e.target.value)} className='home-uploader-input' placeholder='Price at call' />
  	            <input type='text' name='name' value={notUCCInputs.cc} onChange={e => setNotUUCInputs('cc', e.target.value)} className='home-uploader-input' placeholder='Current call' />
  	            <input type='text' name='name' value={notUCCInputs.fdperf} onChange={e => setNotUUCInputs('fdperf', e.target.value)} className='home-uploader-input' placeholder='1d Performance' />
  	            <input type='text' name='name' value={notUCCInputs.fwperf} onChange={e => setNotUUCInputs('fwperf', e.target.value)} className='home-uploader-input' placeholder='1w Performance' />
  	            <input type='text' name='name' value={notUCCInputs.fmperf} onChange={e => setNotUUCInputs('fmperf', e.target.value)} className='home-uploader-input' placeholder='1m Performance' />
                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsOnUploader(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={onSubmitingNotUCC} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleNotUUCUpload()}>
                    {onSubmitingNotUCC ? <TailSpin width={20} height={20} color={'white'} /> : 'Upload'}
                  </button>
                </div>
  	          </>
  	        )}
  	     </div>
  	   </div>	
  	 }




    {isOnEditing && user &&
  	   <div id='tint'>
  	     <div id='home-upload-cont'>
  	        <div style={{ fontFamily: 'poppins' }}>Edit Record</div>
  	        <div id='overview-upload-pick-cont'>  
  	           <div className={isOnEditingUCC ? 'overview-upload-pick overview-upload-pick-active' : 'overview-upload-pick'} onClick={()=> {
  	           	 if (!isOnEditingUCC) setIsEditingOnUCC(true)
  	           }}>Edit Current Calls</div>
  	           <div className={!isOnEditingUCC ? 'overview-upload-pick overview-upload-pick-active' : 'overview-upload-pick'} onClick={()=> {
  	           	 if (isOnEditingUCC) setIsEditingOnUCC(false)
  	           }}>Edit History</div>
  	        </div>
  	        {isOnEditingUCC  ? (
  	           <> 
  	           {Array.isArray(user.currentCallsList)  && user.currentCallsList.length > 0 ?
  	           <>
  	           <select className='home-uploader-input' value={uccElementEditIndex} onChange={e => {
               	setUccElementEditIndex(event.target.value)
               }}>
               {user.currentCallsList.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.token}</option>
               ))}
               </select>
  	            <input type='text' name='name' value={editPassword} onChange={e => setEditPassword(e.target.value)} className='home-uploader-input' placeholder='Password' />
  	            <input type='text' name='name' value={uccElementEdit.token} onChange={e => setUccElementEditInputs('token', e.target.value)} className='home-uploader-input' placeholder='Token' />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={uccElementEdit.chain.includes('ETH')}
                      onChange={() => handleChainsUccElementEditInput('ETH')} /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={uccElementEdit.chain.includes('BTC')}
                      onChange={() =>  handleChainsUccElementEditInput('BTC') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={uccElementEdit.chain.includes('SOL')}
                      onChange={() => handleChainsUccElementEditInput('SOL') } /></div>  
                                          
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={uccElementEdit.chain.includes('BNB')}
                      onChange={() => handleChainsUccElementEditInput('BNB') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox'checked={uccElementEdit.chain.includes('OTHERS')}
                       onChange={() => handleChainsUccElementEditInput('OTHERS') } /></div>
                </div> 
  	            <input type='text' name='name' value={uccElementEdit.ca} onChange={e => setUccElementEditInputs('ca', e.target.value)} className='home-uploader-input' placeholder='CA' />
  	            <input type='text' name='name' value={uccElementEdit.link} onChange={e => setUccElementEditInputs('link', e.target.value)} className='home-uploader-input' placeholder='Link' />
  	            <input type='text' name='name' value={uccElementEdit.doic} onChange={e => setUccElementEditInputs('doic', e.target.value)} className='home-uploader-input' placeholder='Date of Initial Call' />
  	            <input type='text' name='name' value={uccElementEdit.pac} onChange={e => setUccElementEditInputs('pac', e.target.value)} className='home-uploader-input' placeholder='Price at call' />
  	            <input type='text' name='name' value={uccElementEdit.cc} onChange={e => setUccElementEditInputs('cc', e.target.value)} className='home-uploader-input' placeholder='Current price' />
                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsOnEditing(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={isEditingCurrentCalls} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleCurrentCallsEditUpload()}>
                    {isEditingCurrentCalls ? <TailSpin width={20} height={20} color={'white'} /> : 'Rewrite'}
                  </button>
                </div>
                </>
                : <button className='home-uploader-footer-btn' onClick={()=> setIsOnEditing(false)}>Close</button>}
  	           </> 
  	        ) : (
  	           <> 
  	           {Array.isArray(user.history)  && user.history.length > 0 ?
  	           <> 	          
   	            <select className='home-uploader-input' value={notuccElementEditIndex} onChange={e => {
                	setNotUccElementEditIndex(event.target.value) }}>
                {user.history.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.token}</option>
                ))}
                </select>
  	            <input type='text' name='name' value={editPassword} onChange={e => setEditPassword(e.target.value)} className='home-uploader-input' placeholder='Password' />
  	            <input type='text' name='name' value={notuccElementEdit.token} onChange={e => setNotUccElementEditInputs('token', e.target.value)} className='home-uploader-input' placeholder='Token' />


                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={notuccElementEdit.chain.includes('ETH')}
                      onChange={() => handleChainsNotUccElementEditInput('ETH')} /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={notuccElementEdit.chain.includes('BTC')}
                      onChange={() =>  handleChainsNotUccElementEditInput('BTC') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={notuccElementEdit.chain.includes('SOL')}
                      onChange={() => handleChainsNotUccElementEditInput('SOL') } /></div>  
                                          
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={notuccElementEdit.chain.includes('BNB')}
                      onChange={() => handleChainsNotUccElementEditInput('BNB') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox'checked={notuccElementEdit.chain.includes('OTHERS')}
                       onChange={() => handleChainsNotUccElementEditInput('OTHERS') } /></div>
                </div> 
  	            <input type='text' name='name' value={notuccElementEdit.ca} onChange={e => setNotUccElementEditInputs('ca', e.target.value)} className='home-uploader-input' placeholder='CA' />
  	            <input type='text' name='name' value={notuccElementEdit.link} onChange={e => setNotUccElementEditInputs('link', e.target.value)} className='home-uploader-input' placeholder='Link' />
  	            <input type='text' name='name' value={notuccElementEdit.doic} onChange={e => setNotUccElementEditInputs('doic', e.target.value)} className='home-uploader-input' placeholder='Date of Initial Call' />
  	            <input type='text' name='name' value={notuccElementEdit.pac} onChange={e => setNotUccElementEditInputs('pac', e.target.value)} className='home-uploader-input' placeholder='Price at call' />
  	            <input type='text' name='name' value={notuccElementEdit.cc} onChange={e => setNotUccElementEditInputs('cc', e.target.value)} className='home-uploader-input' placeholder='Current call' />
  	            <input type='text' name='name' value={notuccElementEdit.fdperf} onChange={e => setNotUccElementEditInputs('fdperf', e.target.value)} className='home-uploader-input' placeholder='1d Performance' />
  	            <input type='text' name='name' value={notuccElementEdit.fwperf} onChange={e => setNotUccElementEditInputs('fwperf', e.target.value)} className='home-uploader-input' placeholder='1w Performance' />
  	            <input type='text' name='name' value={notuccElementEdit.fmperf} onChange={e => setNotUccElementEditInputs('fmperf', e.target.value)} className='home-uploader-input' placeholder='1m Performance' />
                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsOnEditing(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={isEditingHistory} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleHistoryEditUpload()}>
                    {isEditingHistory ? <TailSpin width={20} height={20} color={'white'} /> : 'Rewrite'}
                  </button>
                </div>
                </>
                : <button className='home-uploader-footer-btn' onClick={()=> setIsOnEditing(false)}>Close</button>}
  	          </>
  	        )}
  	     </div>
  	   </div>	
  	 }



       {isShowingDelete && (
        <div id='tint'>	
          <div id='home-upload-cont'>
            <div style={{ fontFamily: 'poppins' }}>Delete Attributes</div>
            <div id='overview-upload-pick-cont'>  
  	           <div className={isOnDeletingUCC ? 'overview-upload-pick overview-upload-pick-active' : 'overview-upload-pick'} onClick={()=> {
  	           	 if (!isOnDeletingUCC) setIsOnDeletingUCC(true)
  	           }}>Delete Current Calls</div>
  	           <div className={!isOnDeletingUCC ? 'overview-upload-pick overview-upload-pick-active' : 'overview-upload-pick'} onClick={()=> {
  	           	 if (isOnDeletingUCC) setIsOnDeletingUCC(false)
  	           }}>Delete History</div>
  	        </div>
  	        
  	        {isOnDeletingUCC  ? (
  	           <> 
  	           {Array.isArray(user.currentCallsList)  && user.currentCallsList.length > 0 ?
  	           <>
  	           <select className='home-uploader-input' value={uccElementDeleteIndex} onChange={e => {
               	setUccElementDeleteIndex(event.target.value)
               }}>
               {user.currentCallsList.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.token}</option>
               ))}
               </select>
                <input type='text' name='name' value={editPassword} onChange={e => setEditPassword(e.target.value)} className='home-uploader-input' placeholder='Password' />
                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsShowingDelete(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={isDeletingCurrentCalls} style={{ backgroundColor: 'red', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleCurrentCallsDelete()}>
                    {isDeletingCurrentCalls ? <TailSpin width={20} height={20} color={'white'} /> : 'Delete'}
                  </button>
                </div>
                </>
                : <button className='home-uploader-footer-btn' onClick={()=> setIsShowingDelete(false)}>Close</button>}
  	           </> 
  	        ) : (
  	           <> 
  	           {Array.isArray(user.history)  && user.history.length > 0 ?
  	           <>
  	           <select className='home-uploader-input' value={notuccElementDeleteIndex} onChange={e => {
               	setNotUccElementDeleteIndex(event.target.value)
               }}>
               {user.history.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.token}</option>
               ))}
               </select>
               <input type='text' name='name' value={editPassword} onChange={e => setEditPassword(e.target.value)} className='home-uploader-input' placeholder='Password' />
                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsShowingDelete(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={isDeletingHistory} style={{ backgroundColor: 'red', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleHistoryDelete()}>
                    {isDeletingHistory ? <TailSpin width={20} height={20} color={'white'} /> : 'Delete'}
                  </button>
                </div>
                </>
                : <button className='home-uploader-footer-btn' onClick={()=> setIsShowingDelete(false)}>Close</button>}
  	           </> 
  	        )}
          </div>
        </div>
      )}

     <ToastContainer />
   </>
  )
}
