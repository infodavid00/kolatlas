
import { useState, useEffect } from 'react'
import '../index.css'
import { Send } from 'react-feather'
import { TailSpin } from 'react-loader-spinner'
import { useParams } from 'react-router-dom'
import { baseEndpoint } from '../var.jsx'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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
  
  return (
    <>
    {typeof user === 'object' && user?._id ? (
  	 <div id='overview'> 
  	    <div id='overview-a'>
  	       <div className='overview-header'>Metadata</div>
  	       <div id='oa-metadata'>  
  	         <img id='oa-metadata-profile' src={user.image} />
  	         <div>  
  	            <div className='oa-metadata-text' style={{ fontFamily: 'poppins' }}>{user.name}</div>
  	            <a className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.x}>{user.x}</a>
  	            <a className='oa-metadata-text' style={{ color: 'dodgerblue', textDecoration: 'none' }} href={user.tg}>{user.tg}</a>
  	            <div className='oa-metadata-text'>{user.chains}</div>
  	            <div className='oa-metadata-text' style={{ fontFamily: 'poppins' }}>{user.votes} Votes</div>
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
                  <th>Current Call</th>
                </tr>
              </thead>                         
              <tbody>
                {[1,2,3].map((list, index) => (
                  <tr key={index} className='home-table-databody'>
                    <td className='home-table-data'>1234-5678-xxxx</td>
                    <td className='home-table-data'>Dont know what to write here</td>
                    <td className='home-table-data'>$microL20</td>
                    <td className='home-table-data'><a href={''}>https://123.com</a></td>
                    <td className='home-table-data'>10-03-2024</td>
                    <td className='home-table-data'>$30.2</td>
                    <td className='home-table-data'>$10</td>
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
                </tr>
              </thead>                         
              <tbody>
                {[1,2,3].map((list, index) => (
                  <tr key={index} className='home-table-databody'>
                    <td className='home-table-data'>1234-5678-xxxx</td>
                    <td className='home-table-data'>Dont know what to write here</td>
                    <td className='home-table-data'>$microL20</td>
                    <td className='home-table-data'><a href={''}>https://123.com</a></td>
                    <td className='home-table-data'>10-03-2024</td>
                    <td className='home-table-data'>$30.2</td>
                    <td className='home-table-data'>$10</td>
                    <td className='home-table-data'>20%</td>
                    <td className='home-table-data'>10%</td>
                    <td className='home-table-data'>30%</td>
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
             	    <div className='ob-comment-time'>commented {dayjs(element.date).fromNow()}</div>
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
   </>
  )
}
