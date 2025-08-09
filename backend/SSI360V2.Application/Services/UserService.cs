using SSI360V2.Core.DTOs;
using SSI360V2.Core.Entities;
using SSI360V2.Core.Interfaces;
using SSI360V2.Infrastructure.Data;

namespace SSI360V2.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly ApplicationDbContext _context;

    public UserService(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        ApplicationDbContext context)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _context = context;
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(createUserDto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        var user = new User
        {
            Email = createUserDto.Email,
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
            IsActive = createUserDto.IsActive,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        var createdUser = await _userRepository.AddAsync(user);

        // Assign roles
        if (createUserDto.RoleIds.Any())
        {
            foreach (var roleId in createUserDto.RoleIds)
            {
                var userRole = new UserRole
                {
                    UserId = createdUser.Id,
                    RoleId = roleId,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };
                _context.UserRoles.Add(userRole);
            }
            await _context.SaveChangesAsync();
        }

        return await MapToUserDto(createdUser);
    }

    public async Task<UserDto> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        user.FirstName = updateUserDto.FirstName;
        user.LastName = updateUserDto.LastName;
        user.IsActive = updateUserDto.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = "System";

        var updatedUser = await _userRepository.UpdateAsync(user);

        // Update roles
        var existingUserRoles = _context.UserRoles.Where(ur => ur.UserId == id).ToList();
        _context.UserRoles.RemoveRange(existingUserRoles);

        foreach (var roleId in updateUserDto.RoleIds)
        {
            var userRole = new UserRole
            {
                UserId = id,
                RoleId = roleId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };
            _context.UserRoles.Add(userRole);
        }
        await _context.SaveChangesAsync();

        return await MapToUserDto(updatedUser);
    }

    public async Task<UserDto> GetUserByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        return await MapToUserDto(user);
    }

    public async Task<IEnumerable<UserDto>> GetUsersAsync(int page = 1, int pageSize = 10, string? search = null)
    {
        var users = await _userRepository.GetAllAsync();
        
        if (!string.IsNullOrEmpty(search))
        {
            users = users.Where(u => 
                u.FirstName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                u.LastName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                u.Email.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        var pagedUsers = users
            .Skip((page - 1) * pageSize)
            .Take(pageSize);

        var userDtos = new List<UserDto>();
        foreach (var user in pagedUsers)
        {
            userDtos.Add(await MapToUserDto(user));
        }

        return userDtos;
    }

    public async Task DeleteUserAsync(Guid id)
    {
        await _userRepository.DeleteAsync(id);
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
        {
            throw new InvalidOperationException("Current password is incorrect");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = "System";

        await _userRepository.UpdateAsync(user);
        return true;
    }

    private async Task<UserDto> MapToUserDto(User user)
    {
        // Load related data
        var userWithRoles = await _userRepository.GetByEmailAsync(user.Email);
        var roles = userWithRoles?.UserRoles.Select(ur => ur.Role.Name).ToList() ?? new List<string>();

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsActive = user.IsActive,
            LastLoginAt = user.LastLoginAt,
            TenantId = user.TenantId,
            TenantName = "", // Would need to load tenant
            Roles = roles,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
