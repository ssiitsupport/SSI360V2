using SSI360V2.Core.DTOs;

namespace SSI360V2.Core.Interfaces;

public interface IRoleService
{
    Task<RoleDto> CreateRoleAsync(CreateRoleDto createRoleDto);
    Task<RoleDto> UpdateRoleAsync(Guid id, UpdateRoleDto updateRoleDto);
    Task<RoleDto> GetRoleByIdAsync(Guid id);
    Task<PaginatedResult<RoleDto>> GetRolesAsync(int page = 1, int pageSize = 10, string? search = null);
    Task DeleteRoleAsync(Guid id);
}
