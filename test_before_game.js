document.getElementById('happiness-test').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const score = Array.from(form.elements).reduce((acc, el) => acc + (el.checked ? parseInt(el.value) : 0), 0);

    document.getElementById('score').textContent = `Score: ${score}/2`;
    document.getElementById('assessment').textContent = score === 2 ? 
    'Congratulations! It seems you had a happy day.' :
    'It appears you might not be feeling your happiest today. Remember to take time for self-care and do things that bring you joy.';
    document.getElementById('result').classList.remove('hidden');
});