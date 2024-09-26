
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

  
  function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
          toast.success('copied to clipboard!');
      }).catch(err => {
          toast.success('Failed to copy');
      });
  }


  const [tokens, setTokens] = useState([])
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
         if (tokensResponse.ok) {
            const tokensData = await tokensResponse.json();
            if (tokensData.data && tokensData.data.length > 0) {
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


  const [calls, setCalls] = useState(false);
  useEffect(() => {
    async function fetchRecords() {
       try {
          const response = await fetch(`${baseEndpoint}/calls/readSpecific?id=${id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Srt': 'main'
              }
          });
         if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              setCalls(data.data);
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
  
  useEffect(() => {
    if (Array.isArray(calls)) {
      let callsCopy = [...(calls ?? [])]

      if (sortBy === '1') {
        callsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortBy === '2') {
        callsCopy.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortBy === '3') {
        callsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      setCalls(callsCopy);
    }
  }, [sortBy, calls]);

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
                {(Array.isArray(calls) ? calls : []).map((list, index) => (
                  <tr key={index} className='home-table-databody' className='home-table-databody' style={{ backgroundColor : list.initial === 'Y' ? '#f1f1f1' : '', borderTop: list.initial === 'Y' ? '1px solid #ccc' : '' }}>
                    <td className='home-table-data' onClick={()=> window.location.href = '/details/' + list.token}>
                       {(tokens.find(e => e._id === list.token) ?? { _id: '', name: ''})?.name ?? list.token}
                    </td>
                    <td className='home-table-data'>{(list?.chain ?? []).join(', ')}</td>
                    <td className='home-table-data' onClick={()=> copyToClipboard(list.ca)} style={{ cursor: 'pointer', color: 'dodgerblue'}}>
                       {list.ca.slice(0, 3)}...{list.ca.slice(list.ca.length - 3)}</td>
                    <td className='home-table-data'><a href={list.link} target='_blank'>{list.link}</a></td>
                    <td className='home-table-data'>{formatDateTime(list.dd)}</td>
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

     <ToastContainer />
   </>
  )
}
