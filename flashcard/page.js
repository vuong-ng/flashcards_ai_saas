'use client'
import { useUser } from "@clerk/nextjs"
import {useState, useEffect } from 'react'
import { collection, doc, getDoc, getDocs} from 'firebase/firestore'
import db from '@/firebase'
import { Container, Box, Typography, TextField, Paper,Button, CardActionArea, CardContent,Dialog, DialogTitle, DialogContent, DialogContentText, Grid, Card, DialogActions } from "@mui/material"

import {useSearchParams} from 'next/navigation'

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db,'users'), user.id), search)
            const docs = await getDocs(colRef)
            console.log("docs", docs)
            const flashcards =[]

            docs.forEach((doc) => {
                console.log(doc.data)
                flashcards.push({id: doc.id, ...doc.data()})
            }) 
            setFlashcards(flashcards)
            console.log(flashcards)
        }
        getFlashcard()
    }, [user, search])
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]:!prev[id],
        }))
    }
    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{ mt: 4 }}></Grid>
            {flashcards.length > 0 && (
                <Box sx={{mt:4}}>
                    <Typography variant='h5'>Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard) => (
                            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                                <Card p={5}>
                                    <CardActionArea
                                    onClick={() => {handleCardClick(flashcard.id)
                                    }}>
                                        <CardContent>
                                            <Box
                                            sx={{
                                                perspective:"1000px",
                                                '& > div':{
                                                    padding: "10px",
                                                    transition: 'transform 0.6s',
                                                    transformStyle:'preserve-3d',
                                                    position: 'relative',
                                                    width:'100%',
                                                    height:'200px',
                                                    boxShadow:'0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotate(0deg)'
                                                },
                                                '& > div > div':{
                                                    padding: "10px",
                                                    position: 'absolute',
                                                    width:'100%',
                                                    height:'100%',
                                                    backfaceVisibility:"hidden",
                                                    display:"flex",
                                                    justifyContent: "center",
                                                    alignItems:"center",
                                                    apdding:2,
                                                    boxSizing:'border-box'
                                                },
                                                '& > div > div:nth-of-type(2)':{
                                                    padding: "5px",
                                                    transform:'rotateY(180deg)',
                                                }
                                            }}>
                                                <div >
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>

                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    )
}
