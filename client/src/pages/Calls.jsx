import { useState, useEffect } from 'react'
import '../index.css'
import { Send } from 'react-feather'
import { TailSpin } from 'react-loader-spinner'
import { useParams } from 'react-router-dom'
import { baseEndpoint } from '../var.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Calls() {
  const [userNames, setUsernames] = useState([])
  const [tokens, setTokens] = useState([])
  const [userNameSelected, setuserNameSelected] = useState(0)
  const [usertokensSelected, settokensSelected] = useState(0)   
  const [isShowingDelete, setIsShowingDelete] = useState(false)
  const [isShowingEdit, setIsShowingEdit] = useState(false)
             	
  useEffect(() => {
    async function fetchRecords() {
       try {
          const tokensResponse = await fetch(`${baseEndpoint}/tokens/readNames`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
          const usernameResponse = await fetch(`${baseEndpoint}/records/readUsernames`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
         if (tokensResponse.ok && usernameResponse.ok) {
            const tokensData = await tokensResponse.json();
            const usernameData = await usernameResponse.json();
            if (tokensData.data && usernameData.data.length > 0) {
              setUsernames(usernameData.data);
            }
            if (tokensData.data && usernameData.data.length > 0) {
              setTokens(tokensData.data);
            }
         } else {
            throw new Error('Fetching records failed');
         }
       } catch (error) {
          console.error(error);
       }
    }
    fetchRecords()
  }, []);

  const [isOnUploader, setIsOnUploader] = useState(false)
  const handleKeyDown = (event) => {
    if (event.ctrlKey && (event.key === 'x' || event.key === 'X')) {
       setIsOnUploader(true);
    }
    if (event.ctrlKey && (event.key === '1')) {
       event.preventDefault();
       setIsShowingDelete(true);
    }
    if (event.ctrlKey && (event.key === '2')) {
       event.preventDefault();
       setIsShowingEdit(true);
    }
  }; 
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [uploadInputs, setuploadInputs] = useState({
  	 password: '',
  	 kol: '',
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
  const [onSubmitingUpload, setOnSubmitUpload] = useState(false) 
  const handleUpload = async () => {  
  	if (uploadInputs.password && 
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
  	      const bodyToSubmit = {...uploadInputs}     
          bodyToSubmit['kol'] =  userNames[userNameSelected]._id
          bodyToSubmit['token'] =  tokens[usertokensSelected]._id
  	      delete bodyToSubmit.password
  	   	  try {
             const response = await fetch(`${baseEndpoint}/calls/write`, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
                 'X-Srt': 'main',
                 'X-application-password': uploadInputs.password
               },
               body: JSON.stringify(bodyToSubmit) 
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

   const [records, setRecords] = useState(false);
   useEffect(() => {
   async function fetchRecords() {
       try {
          const response = await fetch(`${baseEndpoint}/calls/read?page=0&size=30`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
         if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              setRecords(data.data);
            }
         } else {
            throw new Error('Fetching records failed');
         }
       } catch (error) {
          console.error(error);
       } 
    }
    fetchRecords()
  }, []); 
  const [pageNo, setPageNo] = useState(1)
  const [lockGet, shouldLockGet] = useState(false)
  async function fetchRecords() {
      try {
          shouldLockGet(true)
          const response = await fetch(`${baseEndpoint}/calls/read?page=${pageNo}&size=30`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
         if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              setRecords([...records, ...data.data]);
              setPageNo(pageNo + 1)
              shouldLockGet(false)
            }
         } else {
            throw new Error('Fetching records failed');
         }
       } catch (error) {
          console.error(error);
      } 
  }
  const [sortBy, setSortBy] = useState('1')
  useEffect(() => {
    if (Array.isArray(records)) {
        let sortedRecords;
        if (sortBy === '1') {
            sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === '2') {
            sortedRecords = [...records].sort((a, b) => b.price - a.price);
        } else if (sortBy === '3') {
            sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            sortedRecords = records;
        }
        setRecords(sortedRecords);
    }
  }, [sortBy]);

  function formatDateTime(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
   }


  const [deletingPassword, setDeletinPassword] = useState('')
  const [elementToDelete, setElementToDelete] = useState('')
  const [isDeletingRecord, setisDeletingRecord] = useState(false)

  useEffect(()=> {
  	 if (records) {
  	    setElementToDelete(records[0]._id)
  	 }
  }, [records])

  async function handleRecordDelete(id) {
    setisDeletingRecord(true)
    try {      
      const makerequest = await fetch(`${baseEndpoint}/calls/delete?id=${id}`, {
         method: 'DELETE',
         headers: { 
            'X-Srt': 'main',               	 
            'X-application-password': deletingPassword,
            'Content-Type': 'application/json',
         }
      });
      if (makerequest.ok) {
          window.location.reload()
      } else {
         throw { message: null}
      }
    } catch (error) {
      console.error(error);
      setisDeletingRecord(false);
      return; 
    }
 }


 const [userNameEditSelected, setuserNameEditSelected] = useState(0)
 const [usertokensEditSelected, settokensEditSelected] = useState(0)   
 const [elementToUpdateID, setElementToUpdateID] = useState('')
 const [elementToUpdate, setElementToUpdate] = useState({
 	 password: '',
  	 kol: '',
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
 const [isEditingRecord, setisEditingRecord] = useState(false)
 useEffect(()=> {
   if (Array.isArray(records) && records.length > 0) {
   	   setElementToUpdateID(records[0]._id)
   }
 }, [records])
 
 useEffect(()=> {
   	  if (elementToUpdateID) { 
   	      const record = records.find(e => e._id === elementToUpdateID);
   	      setuserNameEditSelected((userNames.findIndex(e => e._id === record.kol)) === -1 ? 0 : userNames.findIndex(e => e._id === record.kol))
   	      settokensEditSelected((tokens.findIndex(e => e._id === record.token)) === -1 ? 0 : (tokens.findIndex(e => e._id === record.token)) )
   	      setElementToUpdate(records.find(e => e._id === elementToUpdateID))
  	  }
 }, [elementToUpdateID])
  
  useEffect(()=> {
    const callers = (Array.isArray(records) ? records : []).find(e => e._id === elementToUpdateID)?.callers;
  	if (elementToUpdate && callers) {
  		const callerIndex = userNames.findIndex((e) => e._id === callers?._id)
  		setuserNameEditSelected(callerIndex )
  		setlockUNES(true)
  	}
  }, [elementToUpdateID])


 const handleChainsEditInputChange = (val) => {
     const newelementToUpdate = {...elementToUpdate}
     let chains = newelementToUpdate.chain
     const chf = chains.find(e => e.includes(val))
     if (chf) {
        chains = chains.filter(e => !e.includes(val))
     } else {
     	chains.push(val)
     }
     newelementToUpdate["chain"] = chains
     setElementToUpdate(newelementToUpdate)
  };

  async function handleRecordEditing(id, data) {
   	if (elementToUpdate.password && 
  	   elementToUpdate.chain && 
  	   elementToUpdate.ca && 
  	   elementToUpdate.link &&
  	   elementToUpdate.dd && 
  	   elementToUpdate.initial &&
  	   elementToUpdate.price &&
  	   elementToUpdate.fhperf &&
  	   elementToUpdate.fdperf &&
  	   elementToUpdate.fwperf &&
  	   elementToUpdate.fmperf &&
  	   elementToUpdate.tocurrent &&
  	   elementToUpdate.fhprice &&
  	   elementToUpdate.fdprice &&
  	   elementToUpdate.fwprice &&
  	   elementToUpdate.fmprice
  	   ) {
  	      setisEditingRecord(true)  
  	      const bodyToSubmit = {...elementToUpdate}    
  	      bodyToSubmit['kol'] =  userNames[userNameEditSelected]._id
          bodyToSubmit['token'] =  tokens[usertokensEditSelected]._id
  	      delete bodyToSubmit.password
          try { 
             const makerequest = await fetch(`${baseEndpoint}/calls/edit?id=${elementToUpdateID}`, {
                method: 'PUT',
                headers: { 
                  'X-Srt': 'main',               	 
                  'X-application-password': elementToUpdate.password,
                  'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(bodyToSubmit)
             });
             if (makerequest.ok) {
                 window.location.reload()
             } else {
                throw { message: null}
            }
          } catch (error) {
           console.error(error);
           setisEditingRecord(false);
           return; 
         }*/
    }
 }
  const handleEditInputChange = (key, val) => {
     const newelementToUpdate = {...elementToUpdate}
     newelementToUpdate[key] = val
     setElementToUpdate(newelementToUpdate)
  };

   return (
      <>
      {!Array.isArray(records) ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4em' }}>
          <TailSpin width={20} height={20} color={'blue'} />
        </div>
      ) : (
        <> 
          <div id='home-sort'> 
             <div>Sort</div>
             <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
               <option value='1'>Newest - Oldest</option>
               <option value='2'>Price</option>
               <option value='3'>Oldest - Newest</option>
             </select>
          </div>

          <div style={{ marginTop: '1em'}}>
            <div id='home-table-cont'>
               <table id='home-table'>
                 <thead>
                    <tr>
                      <th>Date</th>
                      <th>Kol</th>
                      <th>Token</th>
                      <th>Price</th>
                    </tr>
                 </thead>      
                 <tbody>
                   {records.map((list, index) => (
                     <tr key={index} className='home-table-databody'>
                        <td className='home-table-data'>{formatDateTime(list.date)}</td>
                        <td className='home-table-data' onClick={()=> window.location.href = '/overview/' + list.kol}>
                            {(userNames.find(e => e._id === list.kol) ?? { _id: '', name: ''})?.name ?? list.kol}
                        </td>
                        <td className='home-table-data' onClick={()=> window.location.href = '/details/' + list.token}>
                           {(tokens.find(e => e._id === list.token) ?? { _id: '', name: ''})?.name ?? list.token}
                        </td>
                        <td className='home-table-data'>${list.price}</td>                        
                     </tr>
                   ))} 
                 </tbody>
               </table>
            </div>
            <button id='home-loadmore' disabled={lockGet} onClick={async ()=> {
             if (!lockGet) await fetchRecords()
            }}>Load more</button>
          </div>
        </>
      )}
    

   	  {isOnUploader &&
  	     <div id='tint'>
  	       <div id='home-upload-cont'>
  	          <div style={{ fontFamily: 'poppins' }}>Upload Record</div>
  	          <input type='text' name='password' value={uploadInputs.password} onChange={e => setUPLOADInputs('password', e.target.value)} className='home-uploader-input' placeholder='Password' />
  	          <select className='home-uploader-input' value={userNameSelected} placeholder='Kols' onChange={e => {setuserNameSelected(e.target.value) }}>
                {userNames.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.name}</option>
                ))}
              </select>
  	          <select className='home-uploader-input' value={usertokensSelected} placeholder='Kols' onChange={e => {settokensSelected(e.target.value) }}>
                {tokens.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.name}</option>
                ))}
              </select>
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

           </div>
         </div>
      }



      {isShowingEdit && Array.isArray(records) && (
        <div id='tint'>	
          <div id='home-upload-cont'>
            <div style={{ fontFamily: 'poppins' }}>Edit Record</div>
            <select className='home-uploader-input' value={elementToUpdateID} onChange={e => {
                setElementToUpdateID(e.target.value)
             }}>
               {records.map((element, index)=> (
               	  <option key={index} value={element._id}>
               	      {index + 1} -  {' '}
               	      { (tokens.find(e => e._id === element.token) ?? { _id: '', name: ''})?.name} -{'> '} 
               	      {' '} { (userNames.find(e => e._id === element.kol) ?? { _id: '', name: ''})?.name}
               	  </option>
                ))}
            </select>
            <input type='text' name='password' className='home-uploader-input' placeholder='Root Password' value={elementToUpdate.password} onChange={(e)=> handleEditInputChange('password', e.target.value)} />

  	        <select className='home-uploader-input' value={userNameEditSelected} placeholder='Kols' onChange={e => {setuserNameEditSelected(e.target.value) }}>
                {userNames.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.name}</option>
                ))}
              </select>
  	          <select className='home-uploader-input' value={usertokensEditSelected} placeholder='Kols' onChange={e => {settokensEditSelected(e.target.value) }}>
                {tokens.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.name}</option>
                ))}
            </select>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={elementToUpdate.chain.includes('ETH')}
                      onChange={() => handleChainsEditInputChange('ETH')} /></div>             
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={elementToUpdate.chain.includes('BTC')}
                      onChange={() =>  handleChainsEditInputChange('BTC') } /></div>                     
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={elementToUpdate.chain.includes('SOL')}
                      onChange={() => handleChainsEditInputChange('SOL') } /></div>                                            
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={elementToUpdate.chain.includes('BNB')}
                      onChange={() => handleChainsInput('BNB') } /></div>                      
                <div style={{ display: 'flex', handleChainsEditInputChange: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox' checked={uploadInputs.chain.includes('OTHERS')}
                       onChange={() => handleChainsEditInputChange('OTHERS') } /></div>
            </div>                 
  	        <input type='text' name='name' value={elementToUpdate.ca} onChange={e => handleEditInputChange('ca', e.target.value)} className='home-uploader-input' placeholder='CA' />
  	        <input type='text' value={elementToUpdate.link} onChange={e => handleEditInputChange('link', e.target.value)} className='home-uploader-input' placeholder='Link' />
            <input type='datetime-local' name='dd' value={elementToUpdate.dd} onChange={e => handleEditInputChange('dd', e.target.value)} className='home-uploader-input' />
            <input type='text' value={elementToUpdate.initial} onChange={e => handleEditInputChange('initial', e.target.value)} className='home-uploader-input' placeholder='Initial (Y/N)' />
            <input type='text' value={elementToUpdate.price} onChange={e => handleEditInputChange('price', e.target.value)} className='home-uploader-input' placeholder='Price' />
            <input type='text' value={elementToUpdate.fhperf} onChange={e => handleEditInputChange('fhperf', e.target.value)} className='home-uploader-input' placeholder='1h Performance' />
	        <input type='text' value={elementToUpdate.fdperf} onChange={e => handleEditInputChange('fdperf', e.target.value)} className='home-uploader-input' placeholder='1d Performance' />
            <input type='text' value={elementToUpdate.fwperf} onChange={e => handleEditInputChange('fwperf', e.target.value)} className='home-uploader-input' placeholder='1w Performance' />
            <input type='text' value={elementToUpdate.fmperf} onChange={e => handleEditInputChange('fmperf', e.target.value)} className='home-uploader-input' placeholder='1m Performance' />
            <input type='text'value={elementToUpdate.tocurrent} onChange={e => handleEditInputChange('tocurrent', e.target.value)} className='home-uploader-input' placeholder='To current' />
	        <input type='text' value={elementToUpdate.fhprice} onChange={e => handleEditInputChange('fhprice', e.target.value)} className='home-uploader-input' placeholder='1h Price' />
	        <input type='text' value={elementToUpdate.fdprice} onChange={e => handleEditInputChange('fdprice', e.target.value)} className='home-uploader-input' placeholder='1d Price' />
  	        <input type='text' value={elementToUpdate.fwprice} onChange={e => handleEditInputChange('fwprice', e.target.value)} className='home-uploader-input' placeholder='1w Price' />
  	        <input type='text' value={elementToUpdate.fmprice} onChange={e => handleEditInputChange('fmprice', e.target.value)} className='home-uploader-input' placeholder='1m Price' />
            <div id='home-uploader-footer'>
              <button className='home-uploader-footer-btn' onClick={() => setIsShowingEdit(false)}>Close</button>
              <button className='home-uploader-footer-btn' onClick={async() => {
              	 await handleRecordEditing(elementToUpdate._id, elementToUpdate)
              }} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} disabled={isEditingRecord}>
                {!isEditingRecord ? 'Update' : <TailSpin width={20} height={20} color={'white'} />}
              </button>
            </div>
          </div>
        </div>
      )}



       {isShowingDelete && Array.isArray(records) && (
        <div id='tint'>	
          <div id='home-upload-cont'>
            <div style={{ fontFamily: 'poppins' }}>Delete Record</div>
            <select className='home-uploader-input' value={elementToDelete} onChange={e => {
            	setElementToDelete(e.target.value)
            }}>
               {records.map((element, index)=> (
               	  <option key={index} value={element._id}>
               	      {index + 1} -  {' '}
               	      { (tokens.find(e => e._id === element.token) ?? { _id: '', name: ''})?.name} -{'> '} 
               	      {' '} { (userNames.find(e => e._id === element.kol) ?? { _id: '', name: ''})?.name}
               	  </option>
               ))}
            </select>
            <input type='text' name='password' className='home-uploader-input' placeholder='Root Password' value={deletingPassword} onChange={(e)=> setDeletinPassword(e.target.value)} />
            <div id='home-uploader-footer'>
              <button className='home-uploader-footer-btn' onClick={() => setIsShowingDelete(false)}>Close</button>
              <button className='home-uploader-footer-btn' onClick={async ()=> {
                if (elementToDelete && deletingPassword) {
                    await handleRecordDelete(elementToDelete)
                }
               }} style={{ backgroundColor: 'red', color: 'white', fontFamily: 'poppins' }} disabled={isDeletingRecord}>
                {!isDeletingRecord ? 'Delete' : <TailSpin width={20} height={20} color={'white'} />}
              </button>
            </div>
          </div>
        </div>
      )}
  	  </>
   )
}
