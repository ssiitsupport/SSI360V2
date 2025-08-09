using HotChocolate;
using HotChocolate.Types;
using SSI360V2.Core.DTOs;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.API.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class AuthMutations
{
    public async Task<LoginResponseDto> Login(
        [Service] IAuthService authService,
        string email,
        string password)
    {
        var loginDto = new LoginDto { Email = email, Password = password };
        return await authService.LoginAsync(loginDto);
    }

    public async Task<UserDto> Register(
        [Service] IAuthService authService,
        CreateUserDto createUserDto)
    {
        return await authService.RegisterAsync(createUserDto);
    }
}
