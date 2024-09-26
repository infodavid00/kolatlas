
import { useState, useEffect } from 'react';
import '../index.css';
import { Plus } from 'react-feather';
import { baseEndpoint } from '../var.jsx';
import { TailSpin } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Token() {
  const [showUploader, setShowUploader] = useState(false);
  
  const [inputs, setInputs] = useState({
    password: '',
    name: '',
    x: '',
    tg: '',
    ca: '',
    chart: '',
    website: '',
    chain: [],
    callers: {},
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

  const [userNames, setUsernames] = useState([])
  
  const [userNameSelected, setuserNameSelected] = useState(0)
  useEffect(()=> {
    const NEWD = userNames[userNameSelected]
    if (NEWD) {
       NEWD["date"] = new Date() 
       setInputs({...inputs, callers: NEWD})	
    }
  }, [userNames, userNameSelected])


const handleSubmit = async () => {
  const { password, name, x, tg, ca, chart, website, chain, callers, image } = inputs;
    if (password && name && x && tg && ca && chart && website && chain && callers) {
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
    try {
      const u = { ...inputs, image: imageUrl, date: new Date() }
      delete u["password"]
       u.callers['name'] = ''
      const response = await fetch(`${baseEndpoint}/tokens/write`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Srt': 'main',
          'X-application-password': password
        },
        body: JSON.stringify(u) // Include the image URL
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
          const response = await fetch(`${baseEndpoint}/tokens/read?page=0&size=30`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
          const usernameresponse = await fetch(`${baseEndpoint}/records/readUsernames`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });

         if (response.ok && usernameresponse.ok) {
            const data = await response.json();
            const usernamesdata = await usernameresponse.json();
            if (usernamesdata.data && usernamesdata.data.length > 0) {
              setUsernames(usernamesdata.data);
            }
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
          const response = await fetch(`${baseEndpoint}/tokens/read?page=${pageNo}&size=30`, {
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

   const [elementToDelete, setElementToDelete] = useState('')
   const [isDeletingRecord, setisDeletingRecord] = useState(false)
    
   const [elementToUpdateID, setElementToUpdateID] = useState('')
   
   const [elementToUpdate, setElementToUpdate] = useState(
    { 
       password: '',
       name: '',
       x: '',
       tg: '',
       ca: '',
       chart: '',
       website: '',
       chain: [],
       callers: {},
       image: ''
    })

  const [userNameEditSelected, setuserNameEditSelected] = useState(0)
  const [lockUNES, setlockUNES] = useState(false)

  useEffect(()=> {
    const callers = (Array.isArray(records) ? records : []).find(e => e._id === elementToUpdateID)?.callers;
  	if (elementToUpdate && callers) {
  		const callerIndex = userNames.findIndex((e) => e._id === callers?._id)
  		setuserNameEditSelected(callerIndex )
  		setlockUNES(true)
  	}
  }, [elementToUpdateID])
  
  useEffect(()=> {
    const NEWD = userNames[userNameEditSelected]
    if (NEWD) {
       NEWD["date"] = new Date() 
       setElementToUpdate({...elementToUpdate, callers: NEWD})
    }
  }, [userNames, userNameEditSelected])
  
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
     let chains = elementToAdd.chain
     const chf = chains.find(e => e.includes(val))
     if (chf) {
        chains = chains.filter(e => !e.includes(val))
     } else {
     	chains.push(val)
     }
     elementToAdd["chain"] = chains
     setInputs(elementToAdd)
  };
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

  let imageDupRedun = false

  async function handleRecordEditing(id) {  
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
      delete bodyToUpdate["password"]
      bodyToUpdate.callers.name = ''
      if (imageDupRedun) bodyToUpdate["image"] = imageDupRedun
     
      const makerequest = await fetch(`${baseEndpoint}/tokens/edit?id=${id}`, {
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
      const makerequest = await fetch(`${baseEndpoint}/tokens/delete?id=${id}`, {
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

  function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
          toast.success('copied to clipboard!');
      }).catch(err => {
          toast.success('Failed to copy');
      });
  }

 const [currentTableLink, setCurrentTableLink] = useState('x')

 const [sortBy, setSortBy] = useState('1')

 useEffect(() => {
    if (Array.isArray(records)) {
        let sortedRecords;
        if (sortBy === '1') {
            sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === '2') {
            sortedRecords = [...records].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === '3') {
            sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            sortedRecords = records;
        }
        setRecords(sortedRecords);
    }
  }, [sortBy]);

  function getNamesById(id) {
  	 const i = userNames.find(e => e._id === id)
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
             <option value='2'>A-z</option>
             <option value='3'>Oldest - Newest</option>
           </select>
        </div>
        
        <div style={{ marginTop: '1em'}}>
          <div id='home-table-cont'>
            <table id='home-table'>
              <thead>
                <tr>
                  <th>Pfp</th>
                  <th>Name</th>
                  <th>Chain</th>
                  <th>CA</th>
                  <th>Chart Link</th>
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
                       <option value={'website'}>Website</option>
                     </select>
                  </th>
                  <th>Callers</th>
                </tr>
              </thead>
              <tbody>
                {records.map((list, index) => (
                  <tr key={index} className='home-table-databody'>
                    <td className='home-table-data' onClick={()=> window.location.href = '/details/'+ list._id} style={{ cursor: 'pointer'}}><img className='home-table-data-profile' src={list?.image} /></td>
                    <td className='home-table-data' onClick={()=> window.location.href = '/details/'+ list._id} style={{ cursor: 'pointer'}}>{list?.name}</td>
                    <td className='home-table-data'>{(list?.chain ?? []).join(', ')}</td>
                    <td className='home-table-data' onClick={()=> copyToClipboard(list.ca)} style={{ cursor: 'pointer', color: 'dodgerblue'}}>
                       {list.ca.slice(0, 3)}...{list.ca.slice(list.ca.length - 3)}</td>                       
                    <td className='home-table-data'><a href={list?.chart} target='_blank'>{list?.chart}</a></td>

                    <td className='home-table-data'><a href={currentTableLink === 'x' ? list?.x : currentTableLink === 'website' ? list?.website : list?.tg} target='_blank'>{currentTableLink === 'x' ? list?.x : currentTableLink === 'website' ? list?.website : list?.tg}</a></td>
                                     
                    <td className='home-table-data' onClick={()=> window.location.href = '/overview/'+ list?.callers?._id}>{getNamesById(list?.callers?._id)}</td>
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
            <input type='text' name='x' className='home-uploader-input' placeholder='Twitter' value={inputs.x} onChange={handleInputChange} />
            <input type='text' name='ca' className='home-uploader-input' placeholder='CA' value={inputs.ca} onChange={handleInputChange} />
            <input type='text' name='chart' className='home-uploader-input' placeholder='Chart' value={inputs.chart} onChange={handleInputChange} />
            <input type='text' name='website' className='home-uploader-input' placeholder='Website' value={inputs.website} onChange={handleInputChange} />
            <input type='text' name='tg' className='home-uploader-input' placeholder='Telegram' value={inputs.tg} onChange={handleInputChange} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1em'}}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>ETH</span>
                  <input type='checkbox' checked={inputs.chain.includes('ETH')}
                      onChange={() => handleChainsInputChange('ETH')} /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BTC</span>
                   <input type='checkbox' checked={inputs.chain.includes('BTC')}
                      onChange={() =>  handleChainsInputChange('BTC') } /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>SOL</span>
                   <input type='checkbox' checked={inputs.chain.includes('SOL')}
                      onChange={() => handleChainsInputChange('SOL') } /></div>
                                          
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>BNB</span>
                   <input type='checkbox' checked={inputs.chain.includes('BNB')}
                      onChange={() => handleChainsInputChange('BNB') } /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span>
                   <input type='checkbox'checked={inputs.chain.includes('OTHERS')}
                       onChange={() => handleChainsInputChange('OTHERS') } /></div>
            </div>
            <select className='home-uploader-input' value={userNameSelected} placeholder='Callers' onChange={e => {
            	setuserNameSelected(e.target.value)
            }}>
               {userNames.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.name}</option>
               ))}
            </select>
            
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
            <input type='text' name='name' className='home-uploader-input' placeholder='Name' value={elementToUpdate.name} onChange={(e)=> handleEditInputChange('name', e.target.value)} />
            <input type='text' name='x' className='home-uploader-input' placeholder='Twitter' value={elementToUpdate.x}  onChange={(e)=> handleEditInputChange('x', e.target.value)} />
            <input type='text' name='ca' className='home-uploader-input' placeholder='CA' value={elementToUpdate.ca}  onChange={(e)=> handleEditInputChange('ca', e.target.value)} />
            <input type='text' name='chart' className='home-uploader-input' placeholder='Chart' value={elementToUpdate.chart} onChange={(e)=> handleEditInputChange('chart', e.target.value)} />
            <input type='text' name='website' className='home-uploader-input' placeholder='Website' value={elementToUpdate.website} onChange={(e)=> handleEditInputChange('website', e.target.value)} />
            <input type='text' name='tg' className='home-uploader-input' placeholder='Telegram' value={elementToUpdate.tg} onChange={(e)=> handleEditInputChange('tg', e.target.value)} />
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
                      onChange={() => handleChainsEditInputChange('BNB') } /></div>
                      
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}><span>OTHERS</span>
                   <input type='checkbox'checked={elementToUpdate.chain.includes('OTHERS')}
                       onChange={() => handleChainsEditInputChange('OTHERS') } /></div>
            </div>

            <select className='home-uploader-input' value={userNameEditSelected} placeholder='Callers' onChange={e => {
            	setuserNameEditSelected(e.target.value)
            }}>
               {userNames.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.name}</option>
               ))}
            </select>     
            
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
              	 await handleRecordEditing(elementToUpdate._id)
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
    <ToastContainer />
    </>
  ); 
}
