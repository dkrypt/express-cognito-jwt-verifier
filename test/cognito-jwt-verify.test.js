const axios = require('axios').default;
const spawn = require('child_process').spawn;

const mockServer = spawn('node', ['test/mock-server.js']);

mockServer.stdout.on('data', (data) => {
  console.log('mock-server stdout :\n'+data);
});
mockServer.stderr.on('data', (data) => {
  console.error('mock-server stderr :\n'+data);
  mockServer.kill(2);
});
mockServer.on('close', (code) => {
  console.log('mock-server exited with code : '+code);
});
setTimeout(async () => {
  const response = await axios.get('http://localhost:9009/test', {
    headers: {
      Authorization: `Bearer eyJraWQiOiJRK1ZKVDRsV3JRRG1LV1ZPMTFSaDJcL0g4WUs2U1B1MFFiSlVxUGpidzRkTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2YjJhOTEzNC1mYzNiLTQ2NDItYjBjZS0zYjMzNzUwMTBlNmQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ZNFhlMmFxNUMiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI2YWczYXRxNmpnMzQ5MjFnaHM3ZGwxb2YyZyIsIm9yaWdpbl9qdGkiOiJkOGFhNDgxNS02MDQwLTQwZmMtYjRkMi1hOGFhZjQ5NDdhZTciLCJldmVudF9pZCI6ImNhZTFkNWQ5LWI2MjAtNDk0ZS1iYzJiLTU2NWQ0MTFlNzNkZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2MzQ5MTEzOTksImV4cCI6MTYzNDkxNDk5OSwiaWF0IjoxNjM0OTExMzk5LCJqdGkiOiIyNGZlMzViZi03NzlmLTQ5NDYtOTkyOC02NTNiZTI5MDkwN2IiLCJ1c2VybmFtZSI6IjZiMmE5MTM0LWZjM2ItNDY0Mi1iMGNlLTNiMzM3NTAxMGU2ZCJ9.WWdOPjVDt2b7ZwFqNmMQEQFCiDbar2RIgYHcM7lxwiOHfoK1u5giZxcwtqovTvlG_dgqb_wd4JHKloGUDf52JTqK1e74Lts6-xa71B6bzM_aokE7pC3jw6v-ZyNZ1Pw8EfiVfBtuG5udXo-a9Z7tntBmAh7r8ymtkOX72NWK2SfAa_HCL8SO62Tr6KGE8gdBnoCGUJroM48dK1STUSB23z4sBOyoQ-wRxCRdLB1kpLLPE8rPQTfQ9Z1RW-QKvJhPxm5JjRjg_tY-MeuaCUoTyiUFwHEdAmik0_EXaG4S8QfIVK5I9pWCHe0iw3sK8Iv7-eWZWzFsJTvfj8gy41zGzA`
    }
  });
  mockServer.kill(2);
}, 1500);
