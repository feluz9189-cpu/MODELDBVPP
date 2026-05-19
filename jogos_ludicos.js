const termBoard = document.getElementById('termo');
const guessInput = document.getElementById('tentativa-input');
const submitGuess = document.getElementById('envio-Tentativa');
const resetButton = document.getElementById('reset-button');
const message = document.getElementById('message');
const maxTry = 6;
const MaxTam = 5;
const respostas = ['URUBU', 'PONTO', 'COCAL', 'PEDRA', 'LAGES', 'FLORA', 'XIXÁS','PEQUI','JAMBO','PILAO','GROTA','PIAUI','FAUNA'];
let Palavra = '';
let tentativas = [];
let TentAtual = 0;
let gameOver = false;
let Score = 0;
 
const SUPABASE_URL = 'https://mpiswctnjueijrledhbu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waXN3Y3RuanVlaWpybGVkaGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTY0MTEsImV4cCI6MjA5NDczMjQxMX0.S4RHJ792vC35LFTet-EEFFiRUNKOiDD2DP2QCKImPy8';
 
async function addToGlobalScore(amount) {
    try {
        const res = await fetch(SUPABASE_URL + '/rest/v1/rpc/increment', {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });
        console.log('Resposta Supabase:', res.status);
    } catch (e) {
        console.error('Erro ao adicionar score:', e);
    }
}
 
function chooseSecret() {
    Palavra = respostas[Math.floor(Math.random() * respostas.length)];
}
 
function createRow() {
    const row = document.createElement('div');
    row.className = 'termo-row';
 
    for (let i = 0; i < MaxTam; i += 1) {
        const cell = document.createElement('div');
        cell.className = 'termo-cell';
        row.appendChild(cell);
    }
 
    return row;
}
 
function renderBoard() {
    termBoard.innerHTML = '';
 
    for (let i = 0; i < maxTry; i += 1) {
        const row = createRow();
        const guessData = tentativas[i];
 
        if (guessData) {
            guessData.Palavra.split('').forEach((letter, index) => {
                const cell = row.children[index];
                cell.textContent = letter;
                cell.classList.add(guessData.status[index]);
            });
        }
 
        termBoard.appendChild(row);
    }
}
 
function getStatus(guess) {
    const status = Array(MaxTam).fill('wrong');
    const secretChars = Palavra.split('');
 
    for (let i = 0; i < MaxTam; i += 1) {
        if (guess[i] === secretChars[i]) {
            status[i] = 'correct';
            secretChars[i] = null;
        }
    }
 
    for (let i = 0; i < MaxTam; i += 1) {
        if (status[i] !== 'correct') {
            const foundIndex = secretChars.indexOf(guess[i]);
            if (foundIndex !== -1) {
                status[i] = 'present';
                secretChars[foundIndex] = null;
            }
        }
    }
 
    return status;
}
 
async function submitGuessWord() {
    if (gameOver) return;
 
    const guess = guessInput.value.trim().toUpperCase();
    if (guess.length !== MaxTam) {
        message.textContent = 'Digite exatamente 5 letras.';
        return;
    }
 
    if (!/^[A-ZÀ-Ÿ]{5}$/.test(guess)) {
        message.textContent = 'Use apenas letras.';
        return;
    }
 
    const status = getStatus(guess);
    tentativas[TentAtual] = { Palavra: guess, status };
    renderBoard();
 
    if (status.every(state => state === 'correct')) {
        Score += 100;
        gameOver = true;
        await addToGlobalScore(100);
        message.textContent = `Parabéns! A palavra é ${Palavra}. Foram adicionados 100 pontos ao score geral. Muito obrigado por participar!`;
        return;
    }
 
    TentAtual += 1;
    if (TentAtual >= maxTry) {
        gameOver = true;
        message.textContent = `Fim de jogo! A palavra era ${Palavra}. Tente novamente amanhã!`;
        return;
    }
 
    message.textContent = `Tentativa ${TentAtual + 1} de ${maxTry}.`;
    guessInput.value = '';
    guessInput.focus();
}
 
function resetGame() {
    chooseSecret();
    tentativas = [];
    TentAtual = 0;
    gameOver = false;
    message.textContent = 'Boa sorte!';
    guessInput.value = '';
    guessInput.focus();
    renderBoard();
}
 
submitGuess.addEventListener('click', submitGuessWord);
guessInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        submitGuessWord();
    }
});
resetButton.addEventListener('click', resetGame);
resetGame();
 