 const SUPABASE_URL = 'https://mpiswctnjueijrledhbu.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waXN3Y3RuanVlaWpybGVkaGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTY0MTEsImV4cCI6MjA5NDczMjQxMX0.S4RHJ792vC35LFTet-EEFFiRUNKOiDD2DP2QCKImPy8';

    async function fetchScore() {
        const statusEl = document.getElementById('score-status');
        const valueEl = document.getElementById('score-value');
        statusEl.textContent = 'Atualizando...';
        try {
            const res = await fetch(SUPABASE_URL + '/rest/v1/counter?select=value&id=eq.1', {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Accept': 'application/json'
                }
            });
            console.log('status:', res.status);
            const data = await res.json();
            console.log('data:', data);
            if (data && data[0]) {
                valueEl.textContent = Number(data[0].value).toLocaleString('pt-BR');
                statusEl.textContent = 'Atualizado agora mesmo.';
            } else {
                statusEl.textContent = 'Nenhum dado encontrado.';
            }
        } catch (e) {
            console.error('Erro:', e);
            statusEl.textContent = 'Erro ao buscar o score.';
        }
    }

    fetchScore();