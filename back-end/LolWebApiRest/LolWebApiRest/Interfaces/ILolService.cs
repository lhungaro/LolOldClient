using LolWebAPI.Models;
using System.Text.RegularExpressions;

namespace LolWebApiRest.Interfaces
{
    public interface ILolService
    {
        Task<Account> GetAccountAsync(string username, string tag);
        Task<List<Mastery>> GetMasteryAsync(string piuuid);
        Task<AccountInformations> GetAccountInformations(string piuuid);
        Task<List<Rank>> GetAccountRankByPiuuid(string piuuid);
        Task<List<Matche>> GetMatchesInformationsAsync(string piuuid);
        Task<List<Champion>> GetChampionsAsync();

    }
}
