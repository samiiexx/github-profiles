// Copyright 2021 sfchi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const APIURL = "https://api.github.com/users/";

const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    getRepos(username)
  } catch (error) {
      if(error.response.status === 404) {
        createErrorCard('No profile with this username')
      }
  }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created');
    
        addReposToCard(data);
      } 
    catch (error) {
        createErrorCard('Problem fetching repos')
      }
}

function createUserCard(user) {
  const cardHTML = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>

            <div class="user-info">
                <h1>${user.name}</h1>
                <p>${user.bio}</p>

                <ul>
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repositories</strong></li>
                </ul>

                <div id="repos">
                </div>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML
}

function createErrorCard() {
    const cardHTML = `
        <div class='card'>
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposElement = document.getElementById('repos')

    repos
    .slice(0, 5)
    .forEach(repo => {
        const repoElement = document.createElement('a')
        repoElement.classList.add('repo')
        repoElement.href = repo.html_url
        repoElement.target = '_blank'
        repoElement.innerText = repo.name

        reposElement.appendChild(repoElement)

    })
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
