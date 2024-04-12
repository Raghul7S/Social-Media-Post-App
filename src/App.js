import { Link, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import About from './About';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Missing from './Missing';
import Nav from './Nav';
import Newpost from './Newpost';
import Postpage from './Postpage';
import Post from './Post';
import EditPost from './EditPost';
import Postlayot from './Postlayot';
import { useEffect, useState } from 'react';
import api from './api/posts';

function App() {
  const[posts,setPosts] = useState([])
  const [search, setSearch]=useState('')
  const [searchResults, setSearchResults]=useState([])
  const [postTitle, setPostTitle]=useState('');
  const [postBody, setPostBody]=useState('');
  const [editTitle, setEditTitle]=useState('');
  const [editBody, setEditBody]=useState('');
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchPosts =  async () =>{
      try{
        const response = await api.get('/posts');
        setPosts(response.data);
      }
      catch(err){
        if(err.response){
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        }else{
          console.log(`Error:${err.message}`);
        }
      }
    }
    fetchPosts();
  }, [])

  useEffect(()=>{
    const filteredResults = posts.filter((post)=>
    ((post.body).toLowerCase()).includes(search.toLowerCase()) ||
    ((post.title).toLowerCase()).includes(search.toLowerCase()));  

    setSearchResults(filteredResults.reverse())
  }, [posts,search])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const id = posts.length ? posts[posts.length -1]. id + 1 : 1;
    const datetime = format(new Date(), 'MMM dd, yyyy pp')
    const newPost = {id, title: postTitle, datetime, body: postBody};
    try{
      const response = await api.post('/posts', newPost)
      const allPosts=[...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/')
    }
    catch(err){
        console.log(`Error:${err.message}`);
      }
  }

  const handleEdit = async (id) =>{
    const datetime = format(new Date(), 'MMM dd, yyyy pp')
    const updatedPost = {id, title: editTitle, datetime, body: editBody};
    try{
      const response = await api.put(`/posts/${id}`, updatedPost)
      setPosts(posts.map(post => post.id===id ? updatedPost : post));
      setPostTitle('');
      setPostBody('');
      navigate('/')
    }catch(err){
    console.log(`Error:${err.message}`);
    }
  }

  const handleDelete = async (id) =>{
    try{
    await api.delete(`posts/${id}`)
    const postsList = posts.filter(post => post.id !== id);
    setPosts(postsList);
    navigate('/')
  }
  catch(err){
    console.log(`Error:${err.message}`);
  }
}

  return (
    <div className='App'>
      {/* <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/postpage">Postpage</Link></li>
        </ul>
      </nav>  This the basic structure for "Route" */}

      {/* <Routes>
        <Route  path="/" element={<Home />} />
        <Route  path="/about" element={<About />} />
        <Route  path="/newpost" element={<Newpost />} />
        <Route path="/postpage" element={<Postlayot />}>
         <Route  index element={<Postpage />} />
         <Route  path=":id" element={<Post />} /> 
         <Route  path="newpost" element={<Newpost />} />
         </Route> 
      </Routes>  This is "Route". 'Nest' used here.*/}

      <Header title="Post App"/>
      <Nav 
        search={search}
        setSearch={setSearch}
      />
      <Routes>
          <Route path="/" element={<Home posts={searchResults} />} />
        <Route path="post">
          <Route index element={
              <Newpost 
                handleSubmit={handleSubmit}
                postBody={postBody}
                postTitle={postTitle}
                setPostBody={setPostBody}
                setPostTitle={setPostTitle}
              />} />
          <Route path=":id" element={<Postpage posts={posts} handleDelete={ handleDelete} />} />
        </Route>
        <Route path="/edit/:id" element={<EditPost 
            posts={posts}
            handleEdit={handleEdit}
            editBody={editBody}
            setEditBody={setEditBody}
            editTitle={editTitle}
            setEditTitle={setEditTitle}/>}/>
      <Route path='about' element={<About />} />
      <Route path='*' element={<Missing />} />
        </Routes>

      <Footer />
    </div>
  );
}

export default App;
