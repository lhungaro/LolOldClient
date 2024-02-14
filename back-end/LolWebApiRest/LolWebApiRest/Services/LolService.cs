using LolWebAPI.Models;
using LolWebApiRest.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileSystemGlobbing;
using Newtonsoft.Json;
using System;
using System.Text.RegularExpressions;
using static System.Net.WebRequestMethods;

namespace LolWebAPI.Services
{

    public class LolService : ILolService
    {
        private readonly HttpClient httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly string _baseUrlBr;
        private readonly string _urlChampionsList;
        private readonly string _urlChampionsImage;
        private readonly string _urlIconsImage;

        public LolService(IConfiguration configuration)
        {
            _apiKey = configuration.GetValue<string>("AppSettings:ApiKey");
            _baseUrl = configuration.GetValue<string>("AppSettings:BaseUrl");
            _baseUrlBr = configuration.GetValue<string>("AppSettings:BaseUrlBr");
            _urlChampionsList = configuration.GetValue<string>("AppSettings:urlChampionsList");
            _urlChampionsImage = configuration.GetValue<string>("AppSettings:urlChampionImage");
            _urlIconsImage = configuration.GetValue<string>("AppSettings:urlIconsImage");
            
            httpClient = new HttpClient();
        }

        public async Task<Account> GetAccountAsync(string username,string tag)
        {
            if (!string.IsNullOrEmpty(username))
            {
                try
                {
                    string url = $"{_baseUrl}/riot/account/v1/accounts/by-riot-id/{username}/{tag}?api_key={_apiKey}";

                    HttpResponseMessage response = await httpClient.GetAsync(url);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();

                        Account user = JsonConvert.DeserializeObject<Account>(responseBody);

                        return user;
                    }
                    else
                    {
                        Console.WriteLine($"Failed to get user. Status code: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            // Return null if there is an issue or if username is empty
            return null;
        }

        public async Task<AccountInformations> GetAccountInformations(string piuuid)
        {
            if (!string.IsNullOrEmpty(piuuid))
            {
                try
                {
                    string url = $"{_baseUrlBr}/lol/summoner/v4/summoners/by-puuid/{piuuid}?api_key={_apiKey}";

                    HttpResponseMessage response = await httpClient.GetAsync(url);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();

                        AccountInformations accountInformations = JsonConvert.DeserializeObject<AccountInformations>(responseBody);
                        PreencheIconUrl(accountInformations);

                        return accountInformations;
                    }
                    else
                    {
                        Console.WriteLine($"Failed to get user. Status code: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            // Return null if there is an issue or if username is empty
            return null;
        }
        public async Task<List<Rank>> GetAccountRankByPiuuid(string piuuid)
        {
            if (!string.IsNullOrEmpty(piuuid))
            {
                try
                {
                    string urlAcc = $"{_baseUrlBr}/lol/summoner/v4/summoners/by-puuid/{piuuid}?api_key={_apiKey}";

                    HttpResponseMessage responseAcc = await httpClient.GetAsync(urlAcc);

                    if (responseAcc.IsSuccessStatusCode)
                    {
                        string responseBodyAcc = await responseAcc.Content.ReadAsStringAsync();

                        AccountInformations accountInformations = JsonConvert.DeserializeObject<AccountInformations>(responseBodyAcc);

                        string url = $"{_baseUrlBr}/lol/league/v4/entries/by-summoner/{accountInformations.id}?api_key={_apiKey}";
                        HttpResponseMessage response = await httpClient.GetAsync(url);

                        if (response.IsSuccessStatusCode)
                        {
                            string responseBody = await response.Content.ReadAsStringAsync();

                            List<Rank> rank = JsonConvert.DeserializeObject<List<Rank>>(responseBody);

                            return rank;
                        }
                        else
                        {
                            Console.WriteLine($"Failed to get user. Status code: {response.StatusCode}");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Failed to get user. Status code: {responseAcc.StatusCode}");
                    }
                    
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            // Return null if there is an issue or if username is empty
            return null;
        }

        public async Task<List<Mastery>> GetMasteryAsync(string piuuid)
        {
            if (!string.IsNullOrEmpty(piuuid))
            {
                try
                {
                    string url = $"{_baseUrlBr}/lol/champion-mastery/v4/champion-masteries/by-puuid/{piuuid}?api_key={_apiKey}";

                    HttpResponseMessage response = await httpClient.GetAsync(url);

                    if (response.IsSuccessStatusCode)
                    {
                        // Convert the response content to a string
                        string responseBody = await response.Content.ReadAsStringAsync();
               
                        // Deserialize the JSON into a User object
                        List<Mastery> masterys = JsonConvert.DeserializeObject<List<Mastery>>(responseBody);
                        
                        HttpResponseMessage responseChampionList = await httpClient.GetAsync(_urlChampionsList);

                        if (responseChampionList.IsSuccessStatusCode)
                        {
                            string ChampionListresponseBody = await responseChampionList.Content.ReadAsStringAsync();
                            ChampionList championList = JsonConvert.DeserializeObject<ChampionList>(ChampionListresponseBody);
                            List<Champion> champions = championList.data.Values.ToList();

                            foreach (var mastery in masterys)
                            {
                                var champ = champions.FirstOrDefault(c => c.key == mastery.championId);
                                if (champ != null)
                                {
                                    mastery.ChampName = champ.name;
                                    mastery.ChampUrlImg = _urlChampionsImage + champ.image.full;
                                    mastery.Tags = champ.tags;
                                }
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Failed to get champion list. Status code: {responseChampionList.StatusCode}");
                        }

                        // Return the User object
                        return masterys;
                    }
                    else
                    {
                        Console.WriteLine($"Failed to get mastery. Status code: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            return null;
        }

        private void PreencheIconUrl(AccountInformations accountInformations)
        {
            accountInformations.profileIconUrl = _urlIconsImage + accountInformations.profileIconId + ".png"; 
        }

        public async Task<List<Matche>> GetMatchesInformationsAsync(string puuid)
        {
            if (!string.IsNullOrEmpty(puuid))
            {
                try
                {
                    //Consultando o ID das partidas 
                    string url = $"{_baseUrl}/lol/match/v5/matches/by-puuid/{puuid}/ids?api_key={_apiKey}";


                    HttpResponseMessage response = await httpClient.GetAsync(url);
                    List<string> matchesIds = new List<string>();

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();

                        matchesIds = JsonConvert.DeserializeObject<List<string>>(responseBody);
                    }
                    else
                    {
                        Console.WriteLine($"Failed to get user. Status code: {response.StatusCode}");
                    }

                    //Buscando informações de cada partida separadamente

                    return await GetMatchesInformationsByMatchId(matchesIds);

                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            // Return null if there is an issue or if username is empty
            return null;
        }

        public async Task<List<Matche>> GetMatchesInformationsByMatchId(List<string> matchesIds)
        {
            List<Task<Matche>> matchTasks = new List<Task<Matche>>();

            foreach (var matchId in matchesIds)
            {
                matchTasks.Add(GetMatchInformationAsync(matchId));
            }

            await Task.WhenAll(matchTasks);

            var matches = matchTasks.Select(t => t.Result).ToList();

            return matches; 
        }

        private async Task<Matche> GetMatchInformationAsync(string matchId)
        {
            string urlMatch = $"{_baseUrl}/lol/match/v5/matches/{matchId}?api_key={_apiKey}";
            HttpResponseMessage responseMatch = await httpClient.GetAsync(urlMatch);

            if (responseMatch.IsSuccessStatusCode)
            {
                string responseBodyMatch = await responseMatch.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Matche>(responseBodyMatch);
            }
            else
            {
                Console.WriteLine($"Failed to get match. Status code: {responseMatch.StatusCode}");
                return null;
            }
        }

        public async Task<List<Champion>> GetChampionsAsync()
        {
            try
            {
                string url = _urlChampionsList;

                HttpResponseMessage response = await httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();

                    ChampionList championList = JsonConvert.DeserializeObject<ChampionList>(responseBody);
                    List<Champion> champions = championList.data.Values.ToList();

                    foreach (var champ in champions)
                    {
                            champ.imageUrl = _urlChampionsImage + champ.image.full;
                    }
                    return champions;
                }
                else
                {
                    Console.WriteLine($"Failed to get user. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }

            // Return null if there is an issue or if username is empty
            return null;
        }
        


    }

}