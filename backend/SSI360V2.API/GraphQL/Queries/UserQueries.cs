using HotChocolate;
using HotChocolate.Types;
using SSI360V2.Core.DTOs;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.API.GraphQL.Queries;

[ExtendObjectType("Query")]
public class UserQueries
{
    public async Task<IEnumerable<UserDto>> GetUsers(
        [Service] IUserService userService,
        int page = 1,
        int pageSize = 10,
        string? search = null)
    {
        return await userService.GetUsersAsync(page, pageSize, search);
    }

    public async Task<UserDto> GetUser(
        [Service] IUserService userService,
        Guid id)
    {
        return await userService.GetUserByIdAsync(id);
    }

    public async Task<UserDto?> GetCurrentUser(
        [Service] IAuthService authService)
    {
        return await authService.GetCurrentUserAsync();
    }
}
