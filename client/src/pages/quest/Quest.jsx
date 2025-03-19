import React, { useState, useEffect } from 'react';
import BGContainer from '../../components/ui/BGContainer';
import Navbar from '../../components/ui/Navbar';
import QuestDifficulty from '../../components/ui/QuestDifficulty';
import QuestImageHolder from '../../components/ui/QuestImageHolder';
import AnswerHolder from '../../components/ui/AnswerHolder';
import LetterSet from '../../components/ui/LetterSet';
import RevealBtn from '../../components/ui/RevealBtn';
import RemoveBtn from '../../components/ui/RemoveBtn';
import SubmitBtn from '../../components/ui/SubmitBtn';
import './quest.css';
import RevealLetter from './RevealLetter';

function Quest() {
  const [quest, setQuest] = useState(null);
  const [error, setError] = useState(null);

  const [revealLetter, setRevealLetter] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/quest')
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Quest Data:", data); // For debugging
        if (data?.error) {
          setError(data.error);
        } else {
          setQuest(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load quest:", err);
        setError("Failed to load quest");
      });
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!quest) return <div>Loading...</div>;

  let currLetter = 0;
  let hintIndex = -1;

  return (
    <BGContainer difficulty={quest.difficulty}>
      <div className="quest-page">
        <Navbar />

        <div className="quest-heading">
          <QuestDifficulty level={quest.difficulty.toUpperCase()} />
        </div>

        <div className="quest-content">
          <div className="quest-left">
            <QuestImageHolder images={quest.images || []} />
          </div>

          <div className="quest-right">
            <AnswerHolder words={quest.answer.replace(/_/g, " ").split(" ")} />
            
            <div className="letter-set-wrapper">
              <div className="letter-set-container">
                <LetterSet letters={quest.letterSet} onLetterClick={(id, letter) => {
                  if (currLetter != quest.answer.length) {
                    if (currLetter == hintIndex) {
                      currLetter++;
                    }
                    let selectedIndex = document.getElementById("button" +id);
                    let specAnsHolderH2 = document.getElementById("h2-" +currLetter);
                    selectedIndex.disabled = true;
                    currLetter++;
                    console.log(specAnsHolderH2);
                    specAnsHolderH2.innerHTML = letter;

                  }
                  //console.log(document.getElementById("button" +id));
               //   console.log(document.getElementById(id));
                }} />
              </div>
            </div>

            <div className="action-buttons">
              <RevealBtn onRevealClick={ () => {
                if(hintIndex == -1) {
                    fetch('http://localhost:8080/api/quest/revealLetter', {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify( {answer: quest.answer})
                    }) .then((res) => res.json())
                    .then((data) => {
                      if (data?.error) {
                        setError(data.error);
                      } else {
                        let hintHolderH2 = document.getElementById("h2-" + data.index);
                        hintHolderH2.innerHTML = data.reveleadLetter;
                        hintIndex = data.index;
                      }
                    })
                    .catch((err) => {
                      setError("Failed to load quest");
                    });
                  }}
                }
              />
              <RemoveBtn />
              <SubmitBtn />
            </div>
          </div>
        </div>
      </div>
    </BGContainer>
  );
}

export default Quest;
