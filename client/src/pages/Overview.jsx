
import { useState, useEffect } from 'react'
import '../index.css'
import { Send } from 'react-feather'
import { TailSpin } from 'react-loader-spinner'
import { useParams } from 'react-router-dom'
import { baseEndpoint } from '../var.jsx'

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
           <div className='overview-header'>2.2k Comments</div>
           <div id='ob-comment-s-cont'>
             <textarea placeholder='New comment'></textarea>
             <Send strokeWidth={1} style={{ cursor: 'pointer'}} />
           </div>
           <div id='ob-comment-body'>
             {[1,2,3,4,5,6,7].map((element)=> (
             	<div className='ob-comment'>
             	  <div className='ob-comment-logo'>S</div>
             	  <div>
             	    <div className='ob-comment-txt'>Hi this app sucks like mad, cant even see my ass using it nomore</div>
             	    <div className='ob-comment-time'>commented 10-2-2024</div>
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
