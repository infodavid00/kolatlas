
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

export default function Details() {
  const [user, setUser] = useState(false)
  const { id } = useParams()
  
  useEffect(()=> {
     async function fetchData() {
  	   try {
        const response = await fetch(`${baseEndpoint}/tokens/readOne?id=${id}`, {
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
  const [isOnUCC, setIsOnUCC] = useState(true)

  const [UCCInputs, setUCCInputs] = useState({
  	 password: '',
  	 kol: '',
  	 ic: '',
  	 price: '',
  	 dd: '',
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
  	   UCCInputs.kol && 
  	   UCCInputs.ic && 
  	   UCCInputs.price && 
  	   UCCInputs.dd) {
  	      setOnSubmitUCC(true)
  	      const UCCinputTosumbit = {...UCCInputs}
  	      delete UCCinputTosumbit.password
  	   	  try {
             const response = await fetch(`${baseEndpoint}/tokens/writeActivity?id=${id}`, {
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


  const [uccElementEditIndex, setUccElementEditIndex] = useState(0)
  const [uccElementEdit, setUccElementEdit] =  
        useState(typeof user === "object" && user?.currentCallsList ?  user?.currentCallsList[0] : {})
   const [uccElementDeleteIndex, setUccElementDeleteIndex] = useState(0)
  
  useEffect(() => {
    if (typeof user === "object" && user?.activity) {
       setUccElementEdit(user.activity[uccElementEditIndex]);
    }
  }, [uccElementEditIndex]);

 
  useEffect(() => {
    if (typeof user === "object" && user?.activity && uccElementEditIndex === 0) {
       setUccElementEdit(user.activity[0]);
    }
  }, [user]);
  const [editPassword, setEditPassword] = useState('')
  
const setUccElementEditInputs = (key, value) => {
    const N = { ...uccElementEdit }; // Fix: spread uccElementEdit
    N[key] = value;
    setUccElementEdit(N);
};

  const [isEditingActivity, setisEditingActivity] = useState(false)   
    
  const handleActivityEditUpload = async () => {
  	try {      
  	  setisEditingActivity(true)
  	  const ccl = {activity: [...user?.activity]}
  	  ccl.activity[uccElementEditIndex] = uccElementEdit
      const makerequest = await fetch(`${baseEndpoint}/tokens/edit?id=${id}`, {
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
      setisEditingActivity(false);
      return; 
    }
  }

  
  const [isDeletingActivity, setisDeletingHistory] = useState(false)
  async function handleActivityDelete() {
     const newOne = { activity:
        user.activity.filter((e, index) => index  !==  Number(uccElementDeleteIndex))
      }
     setisDeletingHistory(true)
  	 try {    
      const makerequest = await fetch(`${baseEndpoint}/tokens/edit?id=${id}`, {
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

   function formatDateTime(dateString) {
        const date = new Date(dateString);

        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${month}/${day}/${year} ${hours}:${minutes}`;
    }

  const [sortBy, setSortBy] = useState('1')
  const [sortedActivity, setSortedActivity] = useState([]);


  useEffect(() => {
    if (Array.isArray(user?.activity)) {
      let activityCopy = [...user.activity]; // Create a copy to avoid mutation

      if (sortBy === '1') {
        activityCopy.sort((a, b) => new Date(b.dd) - new Date(a.dd));
      } else if (sortBy === '2') {
        activityCopy.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortBy === '3') {
        activityCopy.sort((a, b) => new Date(a.dd) - new Date(b.dd));
      }

      setSortedActivity(activityCopy);
    }
  }, [sortBy, user]);
  


  return (
    <>
    {typeof user === 'object' && user?._id ? (
  	 <div id='overview'> 
  	    <div id='overview-a'>
  	       <div className='overview-header'>TOKEN OVERVIEW</div>
  	       <div id='oa-metadata'>  
  	         <img id='oa-metadata-profile' src={user.image} />
  	         <div>  
  	            <div className='oa-metadata-text'><span style={{ fontFamily: 'poppins'}}>Name:</span> {user.name}</div>
  	            {/*<div style={{ display: 'flex', alignItems: 'center', gap: '0.4em'}}>X:<a className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.x}>{user.x}</a></div>
  	            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4em'}}>Telegram: <a className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.tg}>{user.tg}</a></div>
  	            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4em'}}>Website: <a className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.website}>{user.website}</a></div>
                 */}
  	            <div className='oa-metadata-text'><span style={{ fontFamily: 'poppins'}}>Chain:</span> {(user?.chain ?? []).join(', ')}</div>
  	         </div>
  	       </div>
           <br />
  	       <div className='overview-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  	          <div>KOL Activity</div>
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
                  <th>Date</th>
                  <th>KOL</th>
                  <th>Initial Call (Y/N)</th>
                  <th>Price</th>
                </tr>
              </thead>                         
              <tbody>
               {sortedActivity.map((list, index) => (
                  <tr key={index} className='home-table-databody' style={{ backgroundColor : list.ic === 'Y' ? '#f1f1f1' : '', borderTop: list.ic === 'Y' ? '1px solid #ccc' : '' }}>
                    <td className='home-table-data'>{formatDateTime(list.dd)}</td>
                    <td className='home-table-data'>{list.kol}</td>
                    <td className='home-table-data'>{list.ic}</td>
                    <td className='home-table-data'>{list.price}</td>
                  </tr>
               ))}
              </tbody>
            </table>
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
  	        <div style={{ fontFamily: 'poppins' }}>Update Activity</div>
  	            <input type='text' name='password' value={UCCInputs.password} onChange={e => setUUCInputs('password', e.target.value)} className='home-uploader-input' placeholder='Password' />
  	            <input type='text' name='kol' value={UCCInputs.kol} onChange={e => setUUCInputs('kol', e.target.value)} className='home-uploader-input' placeholder='KOL' />
  	            <input type='text' name='ic' value={UCCInputs.ic} onChange={e => setUUCInputs('ic', e.target.value)} className='home-uploader-input' placeholder='Initial Value (Y/N)' />
  	            <input type='text' name='price' value={UCCInputs.price} onChange={e => setUUCInputs('price', e.target.value)} className='home-uploader-input' placeholder='price' />

                <input type='datetime-local' id='dd' name='dd' value={UCCInputs.dd}  onChange={e => setUUCInputs('dd', e.target.value)} className='home-uploader-input'   />

                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsOnUploader(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={onSubmitingUCC} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleUUCUpload()}>
                    {onSubmitingUCC ? <TailSpin width={20} height={20} color={'white'} /> : 'Upload'}
                  </button>
                </div>
  	     </div>
  	   </div>	
  	 }




    {isOnEditing && user &&
  	   <div id='tint'>
  	     <div id='home-upload-cont'>
  	        <div style={{ fontFamily: 'poppins' }}>Edit Activity</div>
  	         {Array.isArray(user.activity) && user.activity.length > 0 ?
  	          <>
  	           <select className='home-uploader-input' value={uccElementEditIndex} onChange={e => {
               	setUccElementEditIndex(event.target.value)
               }}>
               {user.activity.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.kol}</option>
               ))}
               </select>
  	            <input type='text' name='password' value={editPassword} onChange={e => setEditPassword(e.target.value)} className='home-uploader-input' placeholder='Password' />
  	            <input type='text' name='kol' value={uccElementEdit.kol} onChange={e => setUccElementEditInputs('kol', e.target.value)} className='home-uploader-input' placeholder='KOL' />
  	            <input type='text' name='ic' value={uccElementEdit.ic} onChange={e => setUccElementEditInputs('ic', e.target.value)} className='home-uploader-input' placeholder='Initial Value (Y/N)' />
  	            <input type='text' name='notes' value={uccElementEdit.price} onChange={e => setUccElementEditInputs('price', e.target.value)} className='home-uploader-input' placeholder='price' />
  
                <input type='datetime-local' name='dd' value={uccElementEdit.dd}  onChange={e => setUccElementEditInputs('dd', e.target.value)} className='home-uploader-input'  />

                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsOnEditing(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={isEditingActivity} style={{ backgroundColor: 'dodgerblue', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleActivityEditUpload()}>
                    {isEditingActivity ? <TailSpin width={20} height={20} color={'white'} /> : 'Rewrite'}
                  </button>
                </div>
                </>
                : <button className='home-uploader-footer-btn' onClick={()=> setIsOnEditing(false)}>Close</button>
              }
  	     </div>
  	   </div>	
  	 }



       {isShowingDelete && (
        <div id='tint'>	
          <div id='home-upload-cont'>
            <div style={{ fontFamily: 'poppins' }}>Delete Activity</div>  	
               <>        
  	           {Array.isArray(user.activity)  && user.activity.length > 0 ?
  	           <>
  	           <select className='home-uploader-input' value={uccElementDeleteIndex} onChange={e => {
               	setUccElementDeleteIndex(event.target.value)
               }}>
               {user.activity.map((element, index)=> (
               	  <option key={index} value={index}>{index + 1} - {element.kol}</option>
               ))}
               </select>
                <input type='text' name='name' value={editPassword} onChange={e => setEditPassword(e.target.value)} className='home-uploader-input' placeholder='Password' />
                <div id='home-uploader-footer'>
                  <button className='home-uploader-footer-btn' onClick={()=> setIsShowingDelete(false)}>Close</button>
                  <button className='home-uploader-footer-btn' disabled={isDeletingActivity} style={{ backgroundColor: 'red', color: 'white', fontFamily: 'poppins' }} onClick={async () => await handleActivityDelete()}>
                    {isDeletingActivity ? <TailSpin width={20} height={20} color={'white'} /> : 'Delete'}
                  </button>
                </div>
                </>
                : <button className='home-uploader-footer-btn' onClick={()=> setIsShowingDelete(false)}>Close</button>
               }
               </>
          </div>
        </div>
      )}

     <ToastContainer />
   </>
  )
}
