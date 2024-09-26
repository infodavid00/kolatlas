import { useState, useEffect } from 'react';
import '../index.css';
import { Plus, ArrowUp, ArrowDown } from 'react-feather';
import { baseEndpoint } from '../var.jsx';
import { TailSpin } from 'react-loader-spinner';

export default function Home() {
  const [showUploader, setShowUploader] = useState(false);
  const [inputs, setInputs] = useState({
    password: '',
    name: '',
    x: '',
    tg: '',
    chains: [],
    currentCalls: [],
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState(false);
  const [isShowingDelete, setIsShowingDelete] = useState(false)
  const [isShowingEdit, setIsShowingEdit] = useState(false)
  
  const handleKeyDown = (event) => {
  if (event.ctrlKey && (event.key === 'x' || event.key === 'X')) {
    event.preventDefault(); // Prevent default action for Ctrl+X
    setShowUploader(true);
  }
  if (event.ctrlKey && (event.key === '1')) {
    event.preventDefault(); // Prevent default action for Ctrl+1
    setIsShowingDelete(true);
  }
  if (event.ctrlKey && (event.key === '2')) {
    event.preventDefault(); // Prevent default action for Ctrl+2
    setIsShowingEdit(true);
  }
  };

  useEffect(() => {
  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
 }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setInputs((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

const handleSubmit = async () => {
  const { password, name, x, tg, chains, currentCalls, image } = inputs;
  if (password && name && x && tg && chains && currentCalls) {
    setIsSubmitting(true);

    let imageUrl = '';
    if (image) {
      // Step 2: Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'th47zcei'); // Replace with your upload preset

      try {
        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dxkzodjlu/image/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.secure_url; // Get the URL of the uploaded image
        } else {
          throw new Error('Image upload failed');
        }
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        return; // Exit if image upload fails
      }
    }

    // Step 3: Submit form data including image URL
    const inp = {...inputs}
    delete inp["password"]
    try {
      const response = await fetch(`${baseEndpoint}/records/write`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Srt': 'main',
          'X-application-password': password
        },
        body: JSON.stringify({ ...inp, image: imageUrl, date: new Date() }) // Include the image URL
      });

      if (response.ok) {
        setShowUploader(false);
        window.location.reload();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
};


  const isSubmitDisabled = Object.values(inputs).some(input => input === '' || input === null) || isSubmitting;

  useEffect(() => {
   async function fetchRecords() {
       try {
          const response = await fetch(`${baseEndpoint}/records/read?limited=1&page=0&size=30`, {
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
          const response = await fetch(`${baseEndpoint}/records/read?limited=1&page=${pageNo}&size=30`, {
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

   const votesMade = JSON.parse(localStorage.getItem('votes')) ?? []
   function hasVoted(id) {
   	  return votesMade.find(e => e === id)
   }
    
   async function Vote(id, count) {
       try {
          console.log(id)
          const response = await fetch(`${baseEndpoint}/records/vote?id=${id}&count=${count}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          })
         if (response.ok) {
           setRecords(records.map(e => {
              const n = {...e}
              if (n._id === id) n.votes = n.votes + count
           	  return n;
           }))
           const clone = [...votesMade, id]
           localStorage.setItem('votes', JSON.stringify(clone)) 
         } else {
            throw new Error('Fetching records failed');
         }
       } catch (error) {
          console.error(error);
       } 
   }

   const [elementToDelete, setElementToDelete] = useState('')
   const [isDeletingRecord, setisDeletingRecord] = useState(false)

   const [elementToUpdateID, setElementToUpdateID] = useState('')
   const [elementToUpdate, setElementToUpdate] = useState({name: '', chains: [], tg: '', x: '', currentCalls: [], image: ''})
   const [isEditingRecord, setisEditingRecord] = useState(false)
   
   useEffect(()=> {
   	 if (Array.isArray(records) && records.length > 0) {
   	   setElementToDelete(records[0]._id)
   	   setElementToUpdateID(records[0]._id)
   	}
   }, [records])
   useEffect(()=> {
   	  if (elementToUpdateID) {
   	      setElementToUpdate(records.find(e => e._id === elementToUpdateID))
   	  }
   }, [elementToUpdateID])
   
  const handleEditImageChange = (e) => {
    if (e.target.files.length > 0) {
      setElementToUpdate((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };
  const handleEditInputChange = (key, val) => {
     const newelementToUpdate = {...elementToUpdate}
     newelementToUpdate[key] = val
     setElementToUpdate(newelementToUpdate)
  };
  const handleChainsInputChange = (val) => {
     const elementToAdd = {...inputs}
     let chains = elementToAdd.chains
     const chf = chains.find(e => e.includes(val))
     if (chf) {
        chains = chains.filter(e => !e.includes(val))
     } else {
     	chains.push(val)
     }
     elementToAdd["chains"] = chains
     setInputs(elementToAdd)
  };
  const handleChainsEditInputChange = (val) => {
     const newelementToUpdate = {...elementToUpdate}
     let chains = newelementToUpdate.chains
     const chf = chains.find(e => e.includes(val))
     if (chf) {
        chains = chains.filter(e => !e.includes(val))
     } else {
     	chains.push(val)
     }
     newelementToUpdate["chains"] = chains
     setElementToUpdate(newelementToUpdate)
  };

  let imageDupRedun = false

  async function handleRecordEditing(id, data) {
    setisEditingRecord(true)     
    try {
      if (typeof elementToUpdate.image !== "string") {
         const formData = new FormData();
         formData.append('file', elementToUpdate.image);
         formData.append('upload_preset', 'th47zcei');
         const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dxkzodjlu/image/upload', {
             method: 'POST',
             body: formData
         });
         if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            imageDupRedun = uploadData.secure_url;
         } else {
            throw new Error('Image upload failed');
         }
      }     
      const bodyToUpdate = {...elementToUpdate}
      if (imageDupRedun) bodyToUpdate["image"] = imageDupRedun
     
      const makerequest = await fetch(`${baseEndpoint}/records/edit?id=${id}`, {
         method: 'PUT',
         headers: { 
            'X-Srt': 'main',               	 
            'X-application-password': elementToUpdate.password,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(bodyToUpdate)
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
    }
 }

 const [deletingPassword, setDeletinPassword] = useState('')
 async function handleRecordDelete(id) {
    setisDeletingRecord(true)
    try {      
      const makerequest = await fetch(`${baseEndpoint}/records/delete?id=${id}`, {
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

 const [currentTableLink, setCurrentTableLink] = useState('x')
 const [sortBy, setSortBy] = useState('1')

 useEffect(() => {
    if (Array.isArray(records)) {
        let sortedRecords;
        if (sortBy === '1') {
            sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === '2') {
            sortedRecords = [...records].sort((a, b) => b.votes - a.votes);
        } else if (sortBy === '3') {
            sortedRecords = [...records].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === '4') {
            sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            sortedRecords = records;
        }
        setRecords(sortedRecords);
    }
  }, [sortBy]);

  const [tokensNames, settokensNames] = useState([])
  useEffect(()=> {
     async function fetchRecords() {
       try {
          const response = await fetch(`${baseEndpoint}/tokens/readNames`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
         if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              settokensNames(data.data)
            }
         } else {
            throw new Error('Fetching records failed');
         }
       } catch (error) {
          console.error(error);
       } 
    }
    fetchRecords()
  }, [])
  function getTokenNameById(id) {
  	 const i = tokensNames.find(e => e._id === id)
  	 return i ? i.name : ''
  }


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
             <option value='2'>Votes</option>
             <option value='3'>A-z</option>
             <option value='4'>Oldest - Newest</option>
           </select>
        </div>
        
        <div style={{ marginTop: '1em'}}>
          <div id='home-table-cont'>
            <table id='home-table'>
              <thead>
                <tr>
                  <th>Votes</th>
                  <th>Pfp</th>
                  <th>Name</th>
                  <th>
                     <select  
                        style={{
                            backgroundColor: 'transparent', 
                            border: 'none', 
                            fontFamily: 'poppins', 
                            color: 'rgba(5, 5, 5, 0.75)'
                        }}
                        value={currentTableLink} onChange={e => {
                        setCurrentTableLink(event.target.value)
                       }}>
                       <option value={'x'}>Twitter</option>
                       <option value={'tg'}>Telegram</option>
                     </select>
                  </th>
                  <th>Chains</th>
                  <th>Current Calls</th>
                </tr>
              </thead>
              <tbody>
                {records.map((list, index) => (
                  <tr key={index} className='home-table-databody'>
                    <td className='home-table-data'>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', width: '2.3em', opacity: hasVoted(list._id) ? 0.5 : 1  }}>
                        <ArrowUp width={20} fill={'rgba(105, 105, 105, 0.7)'} onClick={async ()=> {
                          !hasVoted(list._id) &&  await Vote(list._id, 1)
                        }} className='home-table-votes-ico' />
                        <div style={{ fontFamily: 'poppins', fontSize: 14, color: String(list?.votes).startsWith('-') ? 'tomato' : 'rgba(105, 105, 105, 0.7)' }}>{list?.votes}</div>
                        <ArrowDown width={20} fill={'rgba(105, 105, 105, 0.7)'} style={{ marginTop: '-0.2em' }}  className='home-table-votes-ico' onClick={async ()=> {
                          !hasVoted(list._id) &&  await Vote(list._id, -1)
                        }}  />
                      </div>
                    </td>
                    <td className='home-table-data' onClick={()=> window.location.href = '/overview/'+ list._id} style={{ cursor: 'pointer'}}><img className='home-table-data-profile' src={list?.image} /></td>
                    <td className='home-table-data' onClick={()=> window.location.href = '/overview/'+ list._id} style={{ cursor: 'pointer'}}>{list?.name}</td>
                    <td className='home-table-data'><a href={currentTableLink === 'x' ? list?.x : list?.tg} target='_blank'>{currentTableLink === 'x' ? list?.x : list?.tg}</a></td>
                    <td className='home-table-data'>{(list?.chains ?? []).join(', ')}</td>
                    <td className='home-table-data'>
                        <div style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'flex-start', 
                            flexWrap: 'wrap', 
                            gap: '0.5em' 
                        }}>
                        {(list?.currentCalls ?? []).map((element, index)=> (
                         <div key={index}>
                    	 <a href={'/details/' + element._id}>
                    	    {getTokenNameById(element._id)}
                    	 </a>
                    	 <span>{(index + 1 !== list?.currentCalls?.length) && ','}</span>
                    	 </div>
                       ))}
                       </div>
                    </td>

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

      {showUploader && (
        <div id='tint'>
          <div id='home-upload-cont'>
            <div style={{ fontFamily: 'poppins' }}>Upload Record</div>
            <input type='text' name='password' className='home-uploader-input' placeholder='Root Password' value={inputs.password} onChange={handleInputChange} />
            <input type='text' name='name' className='home-uploader-input' placeholder='Name' value={inputs.name} onChange={handleInputChange} />
            <input type='text' name='x' className='home-uploader-input' placeholder='X' value={inputs.x} onChange={handleInputChange} />
            <input type='text' name='tg' className='home-uploader-input' placeholder='Tg' value={inputs.tg} onChange={handleInputChange} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={inputs.chains.includes('ETH')}
                      onChange={() => handleChainsInputChange('ETH')} /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={inputs.chains.includes('BTC')}
                      onChange={() =>  handleChainsInputChange('BTC') } /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={inputs.chains.includes('SOL')}
                      onChange={() => handleChainsInputChange('SOL') } /></div>  
                                          
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={inputs.chains.includes('BNB')}
                      onChange={() => handleChainsInputChange('BNB') } /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox'checked={inputs.chains.includes('OTHERS')}
                       onChange={() => handleChainsInputChange('OTHERS') } /></div>
            </div>
            {/*<input type='text' name='currentCalls' className='home-uploader-input' placeholder='Current Calls' value={inputs.currentCalls} onChange={handleInputChange} />*/}
            <input type='file' id='file-input' style={{ display: 'none' }} onChange={handleImageChange} />
            <div className='home-uploader-inputupload' onClick={() => document.getElementById('file-input').click()}>
              {inputs.image && <img src={URL.createObjectURL(inputs.image)} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
              <Plus strokeWidth={1} />
            </div>
            <div id='home-uploader-footer'>
              <button className='home-uploader-footer-btn' onClick={() => setShowUploader(false)}>Close</button>
              <button className='home-uploader-footer-btn' onClick={handleSubmit} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} disabled={isSubmitDisabled}>
                {!isSubmitting ? 'Upload' : <TailSpin width={20} height={20} color={'white'} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {isShowingEdit && Array.isArray(records) && (
        <div id='tint'>	
          <div id='home-upload-cont'>
            <div style={{ fontFamily: 'poppins' }}>Edit Record</div>
            <select className='home-uploader-input' value={elementToUpdateID} onChange={e => {
                setElementToUpdateID(e.target.value)
             }}>
               {records.map((element, index)=> (
               	  <option key={index} value={element._id}>{index + 1} - {element.name}</option>
               ))}
            </select>
            <input type='text' name='password' className='home-uploader-input' placeholder='Root Password' value={elementToUpdate.password} onChange={(e)=> handleEditInputChange('password', e.target.value)} />
            <input type='text' name='name' className='home-uploader-input' placeholder='Name' value={elementToUpdate.name}  onChange={(e)=> handleEditInputChange('name', e.target.value)} />
            <input type='text' name='x' className='home-uploader-input' placeholder='X' value={elementToUpdate.x}  onChange={(e)=> handleEditInputChange('x', e.target.value)} />
            <input type='text' name='tg' className='home-uploader-input' placeholder='Tg' value={elementToUpdate.tg}  onChange={(e)=> handleEditInputChange('tg', e.target.value)} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span> 
                  <input type='checkbox' checked={elementToUpdate.chains.includes('ETH')}
                      onChange={() => handleChainsEditInputChange('ETH')} /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span> 
                   <input type='checkbox' checked={elementToUpdate.chains.includes('BTC')}
                      onChange={() =>  handleChainsEditInputChange('BTC') } /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span> 
                   <input type='checkbox' checked={elementToUpdate.chains.includes('SOL')}
                      onChange={() => handleChainsEditInputChange('SOL') } /></div>  
                                          
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span> 
                   <input type='checkbox' checked={elementToUpdate.chains.includes('BNB')}
                      onChange={() => handleChainsEditInputChange('BNB') } /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span> 
                   <input type='checkbox'checked={elementToUpdate.chains.includes('OTHERS')}
                       onChange={() => handleChainsEditInputChange('OTHERS') } /></div>
            </div>
            {/*<input type='text' name='currentCalls' className='home-uploader-input' placeholder='Current Calls' value={elementToUpdate.currentCalls}  onChange={(e)=> handleEditInputChange('currentCalls', e.target.value)} />*/}
            <input type='file' id='file-input-edit' style={{ display: 'none' }} onChange={handleEditImageChange} />
            <div className='home-uploader-inputupload' onClick={() => document.getElementById('file-input-edit').click()}>
              {elementToUpdate.image ? 
                 <img src={typeof elementToUpdate.image === "string" ? elementToUpdate.image : URL.createObjectURL(elementToUpdate.image)} style={{ width: '100%', height: 'auto' }} />
                 :
                 <Plus strokeWidth={1} />
              }
            </div>
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
            	setElementToDelete(event.target.value)
            }}>
               {records.map((element, index)=> (
               	  <option key={index} value={element._id}>{index + 1} - {element.name}</option>
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
  );
}
