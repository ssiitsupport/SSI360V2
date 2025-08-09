using SSI360V2.Core.DTOs;

namespace SSI360V2.Core.Interfaces;

public interface IUserService
{
    Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
    Task<UserDto> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto);
    Task<UserDto> GetUserByIdAsync(Guid id);
    Task<IEnumerable<UserDto>> GetUsersAsync(int page = 1, int pageSize = 10, string? search = null);
    Task DeleteUserAsync(Guid id);
    Task<bool> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
}
