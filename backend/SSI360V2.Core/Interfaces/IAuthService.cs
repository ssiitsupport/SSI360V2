using SSI360V2.Core.DTOs;

namespace SSI360V2.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
    Task<UserDto> RegisterAsync(CreateUserDto createUserDto);
    Task<bool> ValidateTokenAsync(string token);
    Task<UserDto?> GetCurrentUserAsync();
    Task<bool> HasPermissionAsync(string resource, string action);
}
