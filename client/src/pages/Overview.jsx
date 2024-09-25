
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

  const handleKeyDown = (event) => {
    if (event.ctrlKey && (event.key === 'x' || event.key === 'X')) {
       setIsOnUploader(true);
    }
    if (event.ctrlKey && (event.key === '2')) {
       event.preventDefault();
       setIsOnEditing(true); 
    }
    if (event.ctrlKey && (event.key === '1')) {
       event.preventDefault();
       setIsShowingDelete(true);
    }
 };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const [isOnUploader, setIsOnUploader] = useState(false)

  const [uploadInputs, setuploadInputs] = useState({
  	 password: '',
  	 token: '',
  	 chain: [],
  	 ca: '',
  	 link: '',
  	 dd: '',
  	 initial: '',
  	 price: '',
  	 fhperf: '',
  	 fdperf: '',
  	 fwperf: '',
  	 fmperf: '',
  	 tocurrent: '',
  	 fhprice: '',
  	 fdprice: '',
  	 fwprice: '',
  	 fmprice: '',
  	 date: new Date()
  })
  const setUPLOADInputs = (key, value) => {
  	const N = {...uploadInputs}
  	N[key] = value
  	setuploadInputs(N)
  }

  const [onSubmitingUpload, setOnSubmitUpload] = useState(false)

  const handleUpload = async () => {
  	if (uploadInputs.password && 
  	   uploadInputs.token && 
  	   uploadInputs.chain && 
  	   uploadInputs.ca && 
  	   uploadInputs.link &&
  	   uploadInputs.dd && 
  	   uploadInputs.initial &&
  	   uploadInputs.price &&
  	   uploadInputs.fhperf &&
  	   uploadInputs.fdperf &&
  	   uploadInputs.fwperf &&
  	   uploadInputs.fmperf &&
  	   uploadInputs.tocurrent &&
  	   uploadInputs.fhprice &&
  	   uploadInputs.fdprice &&
  	   uploadInputs.fwprice &&
  	   uploadInputs.fmprice
  	   ) {
  	      setOnSubmitUpload(true)
  	      const inputToSubmit = {...uploadInputs}
  	      delete inputToSubmit.password
  	   	  try {
             const response = await fetch(`${baseEndpoint}/records/writeCalls?id=${id}`, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
                 'X-Srt': 'main',
                 'X-application-password': uploadInputs.password
               },
               body: JSON.stringify(inputToSubmit) 
             });
             if (response.ok) {
               setOnSubmitUpload(false);
               window.location.reload();
             } else {
               throw new Error('Submission failed');
             }
          } catch (error) {
            console.error(error);
          } finally {
            setOnSubmitUpload(false);
          }
  	  }
  }


  const [isEditingCalls, setisEditingCalls] = useState(false)
  const [elementEditIndex, setelementEditIndex] = useState(0)
  const [elementEdit, setelementEdit] =  
        useState(typeof user === "object" && user?.calls ?  user?.calls[0] : {})

  useEffect(() => {
    if (typeof user === "object" && user?.calls) {
       setelementEdit(user.calls[elementEditIndex]);
    }
  }, [elementEditIndex]);

  useEffect(() => {
    if (typeof user === "object" && user?.calls && elementEditIndex === 0) {
       setelementEdit(user.calls[0]);
    }
  }, [user]);
  
  const [editPassword, setEditPassword] = useState('')
  

  const setELEMENTEditInputs = (key, value) => {
    const N = { ...elementEdit }; 
    N[key] = value;
    setelementEdit(N);
  };

  const handleCallsEditUpload = async () => {
  	try {    
  	  setisEditingCalls(true)
  	  const ch = {calls: [...user?.calls]}
  	  ch.calls[elementEditIndex] = elementEdit
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
      setisEditingCalls(false);
      return; 
    }
  }

   const handleChainsEditInput = (val) => {
     const newelementToUpdate = {...elementEdit}
       /*const [isEditingCalls, setisEditingCalls] = useState(false)
  const [elementEditIndex, setelementEditIndex] = useState(0)
  const [elementEdit, setelementEdit] =  
        useState(typeof user === "object" && user?.calls ?  user?.calls[0] : {})*/

     let chain = elementEdit.chain
     const chf = chain.find(e => e.includes(val))
     if (chf) {
        chain = chain.filter(e => !e.includes(val))
     } else {
     	chain.push(val)
     }
     setelementEdit({...elementEdit, chain: chain})
  };


   const handleChainsInput = (val) => {
     const newelementToUpdate = {...uploadInputs}
     let chain = uploadInputs.chain
     const chf = chain.find(e => e.includes(val))
     if (chf) {
        chain = chain.filter(e => !e.includes(val))
     } else {
     	chain.push(val)
     }
     setuploadInputs({...newelementToUpdate, chain: chain})
  };


  const [elementDeleteIndex, setelementDeleteIndex] = useState(0)
  const [isDeletingHistory, setisDeletingHistory] = useState(false)

  async function handleHistoryDelete() {
     const newOne = { calls:
        user.calls.filter((e, index) => {
            return e.token  !==  user.calls[elementDeleteIndex].token
        }) 
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

  const [sortBy, setSortBy] = useState('1')
  const [sortedCalls, setSortedCalls] = useState([]);


  useEffect(() => {
    if (Array.isArray(user?.calls)) {
      let callsCopy = [...(user?.calls ?? [])]

      if (sortBy === '1') {
        callsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortBy === '2') {
        callsCopy.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortBy === '3') {
        callsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      setSortedCalls(callsCopy);
    }
  }, [sortBy, user]);


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
  	            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4em'}}>
  	               <span style={{ fontFamily: 'poppins',  color: 'rgba(5,5,5,0.9)', fontSize: 14 }}>Twitter:</span> 
  	               <a target='_blank' className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.x}>{user.x}</a>
  	            </div>
  	            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4em'}}>
  	               <span style={{ fontFamily: 'poppins', color: 'rgba(5,5,5,0.9)', fontSize: 14 }}>Telegram:</span> 
  	                <a target='_blank' className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.tg}>{user.tg}</a>
                </div>
  	            <div className='oa-metadata-text'>{(user?.chains ?? []).join(', ')}</div>
  	            <div className='oa-metadata-text'><span style={{ fontFamily: 'poppins' }}>Score:</span> {user.votes}</div>
  	         </div>
  	       </div>
           <br />
           
  	       <div className='overview-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  	          <div>Calls</div>
              <div id='home-sort' style={{ marginTop: '0'}}> 
                 <div>Sort</div>
                 <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                   <option value='1'>Newest - Oldest</option>
                   <option value='2'>Price</option>
                   <option value='3'>Oldest - Newest</option>
                </select>
              </div>              
  	       </div>

           <div id='table-patcher'>
  	       <table id='home-table'>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Chain</th>
                  <th>CA</th>
                  <th>Link</th>
                  <th>Date</th>
                  <th>Initial</th>
                  <th>Price</th>
                  <th>1h performance</th>
                  <th>1d performance</th>
                  <th>1w performance</th>
                  <th>1m performance</th>
                  <th>To current</th>
                  <th>Performance</th>
                </tr>
              </thead>                         
              <tbody>
                {(sortedCalls).map((list, index) => (
                  <tr key={index} className='home-table-databody' className='home-table-databody' style={{ backgroundColor : list.initial === 'Y' ? '#f1f1f1' : '', borderTop: list.initial === 'Y' ? '1px solid #ccc' : '' }}>
                    <td className='home-table-data'>{list.token}</td>
                    <td className='home-table-data'>{(list?.chain ?? []).join(', ')}</td>
                    <td className='home-table-data' onClick={()=> copyToClipboard(list.ca)} style={{ cursor: 'pointer', color: 'dodgerblue'}}>
                       {list.ca.slice(0, 3)}...{list.ca.slice(list.ca.length - 3)}</td>
                    <td className='home-table-data'><a href={list.link} target='_blank'>{list.link}</a></td>
                    <td className='home-table-data'>{list.dd}</td>
                    <td className='home-table-data'>{list.initial}</td>
                    <td className='home-table-data'>${list.price}</td>
                    <td className='home-table-data'>{list.fhperf}%</td>
                    <td className='home-table-data'>{list.fdperf}%</td>
                    <td className='home-table-data'>{list.fwperf}%</td>
                    <td className='home-table-data'>{list.fmperf}%</td>
                    <td className='home-table-data'>{list.tocurrent}</td>
                    <td className='home-table-data'  style={{ display: 'flex', borderLeft: '1px solid #eee', backgroundColor: '#f8f8f8', padding: 0, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
                       <div style={{ fontSize: 13, borderBottom: '1px solid #eee', width: '100%', textAlign: 'center'}}>
                           {((Number(list.price) / Number(list.fhprice)) - 1).toFixed(2) }%</div>
                       <div style={{ fontSize: 13, borderBottom: '1px solid #eee', width: '100%', textAlign: 'center'}}>
                           {((Number(list.price) / Number(list.fdprice)) - 1).toFixed(2) }%</div>
                       <div style={{ fontSize: 13, borderBottom: '1px solid #eee', width: '100%', textAlign: 'center'}}>
                           {((Number(list.price) / Number(list.fwprice)) - 1).toFixed(2) }%</div>
                       <div style={{ fontSize: 13, borderBottom: '1px solid #eee', width: '100%', textAlign: 'center'}}>
                           {((Number(list.price) / Number(list.fmprice)) - 1).toFixed(2) }%</div>
                    </td>
                    
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
  	        <div style={{ fontFamily: 'poppins' }}>Add Call</div>
  	          <>

  	            <input type='text' name='name' value={uploadInputs.password} onChange={e => setUPLOADInputs('password', e.target.value)} className='home-uploader-input' placeholder='Password' />
  	            <input type='text' name='name' value={uploadInputs.token} onChange={e => setUPLOADInputs('token', e.target.value)} className='home-uploader-input' placeholder='Token' />

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={uploadInputs.chain.includes('ETH')}
                      onChange={() => handleChainsInput('ETH')} /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={uploadInputs.chain.includes('BTC')}
                      onChange={() =>  handleChainsInput('BTC') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={uploadInputs.chain.includes('SOL')}
                      onChange={() => handleChainsInput('SOL') } /></div>  
                                          
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={uploadInputs.chain.includes('BNB')}
                      onChange={() => handleChainsInput('BNB') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox'checked={uploadInputs.chain.includes('OTHERS')}
                       onChange={() => handleChainsInput('OTHERS') } /></div>
                </div> 
                
  	            <input type='text' name='name' value={uploadInputs.ca} onChange={e => setUPLOADInputs('ca', e.target.value)} className='home-uploader-input' placeholder='CA' />
  	            <input type='text' value={uploadInputs.link} onChange={e => setUPLOADInputs('link', e.target.value)} className='home-uploader-input' placeholder='Link' />
                <input type='datetime-local' name='dd' value={uploadInputs.dd} onChange={e => setUPLOADInputs('dd', e.target.value)} className='home-uploader-input' />
                <input type='text' value={uploadInputs.initial} onChange={e => setUPLOADInputs('initial', e.target.value)} className='home-uploader-input' placeholder='Initial (Y/N)' />
  	            <input type='text' value={uploadInputs.price} onChange={e => setUPLOADInputs('price', e.target.value)} className='home-uploader-input' placeholder='Price' />
  	            <input type='text' value={uploadInputs.fhperf} onChange={e => setUPLOADInputs('fhperf', e.target.value)} className='home-uploader-input' placeholder='1h Performance' />
  	            <input type='text' value={uploadInputs.fdperf} onChange={e => setUPLOADInputs('fdperf', e.target.value)} className='home-uploader-input' placeholder='1d Performance' />
  	            <input type='text' value={uploadInputs.fwperf} onChange={e => setUPLOADInputs('fwperf', e.target.value)} className='home-uploader-input' placeholder='1w Performance' />
  	            <input type='text' value={uploadInputs.fmperf} onChange={e => setUPLOADInputs('fmperf', e.target.value)} className='home-uploader-input' placeholder='1m Performance' />
  	            <input type='text'value={uploadInputs.tocurrent} onChange={e => setUPLOADInputs('tocurrent', e.target.value)} className='home-uploader-input' placeholder='To current' />

  	            <input type='text' value={uploadInputs.fhprice} onChange={e => setUPLOADInputs('fhprice', e.target.value)} className='home-uploader-input' placeholder='1h Price' />
  	            <input type='text' value={uploadInputs.fdprice} onChange={e => setUPLOADInputs('fdprice', e.target.value)} className='home-uploader-input' placeholder='1d Price' />
  	            <input type='text' value={uploadInputs.fwprice} onChange={e => setUPLOADInputs('fwprice', e.target.value)} className='home-uploader-input' placeholder='1w Price' />
  	            <input type='text' value={uploadInputs.fmprice} onChange={e => setUPLOADInputs('fmprice', e.target.value)} className='home-uploader-input' placeholder='1m Price' />

                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsOnUploader(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={onSubmitingUpload} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleUpload()}>
                    {onSubmitingUpload ? <TailSpin width={20} height={20} color={'white'} /> : 'Upload'}
                  </button>
                </div>
  	          </>
  	     </div>
  	   </div>	
  	 }


    {isOnEditing && user &&
  	   <div id='tint'>
  	     <div id='home-upload-cont'>
  	        <div style={{ fontFamily: 'poppins' }}>Edit Call</div>
  	           <> 
  	           {Array.isArray(user.calls)  && user.calls.length > 0 ?
  	           <> 	       
   	            <select className='home-uploader-input' value={elementEditIndex} onChange={e => {
                	setelementEditIndex(event.target.value) }}>
                {user.calls.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.token}</option>
                ))}
                </select>
        	    <input type='text' name='name' value={editPassword} onChange={e => setEditPassword(e.target.value)} className='home-uploader-input' placeholder='Password' />
  	            <input type='text' name='name' value={elementEdit.token} onChange={e => setELEMENTEditInputs('token', e.target.value)} className='home-uploader-input' placeholder='Token' />

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={elementEdit.chain?.includes('ETH')}
                      onChange={() => handleChainsEditInput('ETH')} /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={elementEdit?.chain?.includes('BTC')}
                      onChange={() =>  handleChainsEditInput('BTC') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={elementEdit?.chain?.includes('SOL')}
                      onChange={() => handleChainsEditInput('SOL') } /></div>  
                                          
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={elementEdit?.chain?.includes('BNB')}
                      onChange={() => handleChainsEditInput('BNB') } /></div>
                      
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox'checked={elementEdit?.chain?.includes('OTHERS')}
                       onChange={() => handleChainsEditInput('OTHERS') } /></div>
                </div> 
                
  	            <input type='text' value={elementEdit.ca} onChange={e => setELEMENTEditInputs('ca', e.target.value)} className='home-uploader-input' placeholder='CA' />
  	            <input type='text' value={elementEdit.link} onChange={e => setELEMENTEditInputs('link', e.target.value)} className='home-uploader-input' placeholder='Link' />
                <input type='datetime-local' name='dd' value={elementEdit.dd} onChange={e => setELEMENTEditInputs('dd', e.target.value)} className='home-uploader-input' />
                <input type='text' value={elementEdit.initial} onChange={e => setELEMENTEditInputs('initial', e.target.value)} className='home-uploader-input' placeholder='Initial (Y/N)' />
  	            <input type='text' value={elementEdit.price} onChange={e => setELEMENTEditInputs('price', e.target.value)} className='home-uploader-input' placeholder='Price' />
  	            <input type='text' value={elementEdit.fhperf} onChange={e => setELEMENTEditInputs('fhperf', e.target.value)} className='home-uploader-input' placeholder='1h Performance' />
  	            <input type='text' value={elementEdit.fdperf} onChange={e => setELEMENTEditInputs('fdperf', e.target.value)} className='home-uploader-input' placeholder='1d Performance' />
  	            <input type='text' value={elementEdit.fwperf} onChange={e => setELEMENTEditInputs('fwperf', e.target.value)} className='home-uploader-input' placeholder='1w Performance' />
  	            <input type='text' value={elementEdit.fmperf} onChange={e => setELEMENTEditInputs('fmperf', e.target.value)} className='home-uploader-input' placeholder='1m Performance' />
  	            <input type='text'value={elementEdit.tocurrent} onChange={e => setELEMENTEditInputs('tocurrent', e.target.value)} className='home-uploader-input' placeholder='To current' />

  	            <input type='text' value={elementEdit.fhprice} onChange={e => setELEMENTEditInputs('fhprice', e.target.value)} className='home-uploader-input' placeholder='1h Price' />
  	            <input type='text' value={elementEdit.fdprice} onChange={e => setELEMENTEditInputs('fdprice', e.target.value)} className='home-uploader-input' placeholder='1d Price' />
  	            <input type='text' value={elementEdit.fwprice} onChange={e => setELEMENTEditInputs('fwprice', e.target.value)} className='home-uploader-input' placeholder='1w Price' />
  	            <input type='text' value={elementEdit.fmprice} onChange={e => setELEMENTEditInputs('fmprice', e.target.value)} className='home-uploader-input' placeholder='1m Price' />  	  

                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsOnEditing(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={isEditingCalls} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleCallsEditUpload()}>
                    {isEditingCalls ? <TailSpin width={20} height={20} color={'white'} /> : 'Rewrite'}
                  </button>
                </div>
                </>
                : <button className='home-uploader-footer-btn' onClick={()=> setIsOnEditing(false)}>Close</button>}
  	          </>
  	     </div>
  	   </div>	
  	 }



       {isShowingDelete && (
        <div id='tint'>	
          <div id='home-upload-cont'>
            <div style={{ fontFamily: 'poppins' }}>Delete Call</div>
  	        
  	           <> 
  	           {Array.isArray(user?.calls) && user.calls.length > 0 ?
  	           <>
  	           <select className='home-uploader-input' value={elementDeleteIndex} onChange={e => {
               	setelementDeleteIndex(event.target.value)
               }}>
               {user.calls.map((element, index)=> (
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
          </div>
        </div>
      )}

     <ToastContainer />
   </>
  )
}
