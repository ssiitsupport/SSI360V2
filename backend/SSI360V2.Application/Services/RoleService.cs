using SSI360V2.Core.DTOs;
using SSI360V2.Core.Entities;
using SSI360V2.Core.Interfaces;
using SSI360V2.Infrastructure.Data;

namespace SSI360V2.Application.Services;

public class RoleService : IRoleService
{
    private readonly IRoleRepository _roleRepository;
    private readonly IPermissionRepository _permissionRepository;
    private readonly ApplicationDbContext _context;

    public RoleService(
        IRoleRepository roleRepository,
        IPermissionRepository permissionRepository,
        ApplicationDbContext context)
    {
        _roleRepository = roleRepository;
        _permissionRepository = permissionRepository;
        _context = context;
    }

    public async Task<RoleDto> CreateRoleAsync(CreateRoleDto createRoleDto)
    {
        var role = new Role
        {
            Name = createRoleDto.Name,
            Description = createRoleDto.Description,
            IsActive = createRoleDto.IsActive,
            TenantId = createRoleDto.TenantId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        var createdRole = await _roleRepository.AddAsync(role);

        // Assign permissions
        if (createRoleDto.PermissionIds.Any())
        {
            foreach (var permissionId in createRoleDto.PermissionIds)
            {
                var rolePermission = new RolePermission
                {
                    RoleId = createdRole.Id,
                    PermissionId = permissionId,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };
                _context.RolePermissions.Add(rolePermission);
            }
            await _context.SaveChangesAsync();
        }

        return await MapToRoleDto(createdRole);
    }

    public async Task<RoleDto> UpdateRoleAsync(Guid id, UpdateRoleDto updateRoleDto)
    {
        var role = await _roleRepository.GetByIdAsync(id);
        if (role == null)
        {
            throw new InvalidOperationException("Role not found");
        }

        role.Name = updateRoleDto.Name;
        role.Description = updateRoleDto.Description;
        role.IsActive = updateRoleDto.IsActive;
        role.UpdatedAt = DateTime.UtcNow;
        role.UpdatedBy = "System";

        var updatedRole = await _roleRepository.UpdateAsync(role);

        // Update permissions
        var existingRolePermissions = _context.RolePermissions.Where(rp => rp.RoleId == id).ToList();
        _context.RolePermissions.RemoveRange(existingRolePermissions);

        foreach (var permissionId in updateRoleDto.PermissionIds)
        {
            var rolePermission = new RolePermission
            {
                RoleId = id,
                PermissionId = permissionId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };
            _context.RolePermissions.Add(rolePermission);
        }
        await _context.SaveChangesAsync();

        return await MapToRoleDto(updatedRole);
    }

    public async Task<RoleDto> GetRoleByIdAsync(Guid id)
    {
        var role = await _roleRepository.GetByIdAsync(id);
        if (role == null)
        {
            throw new InvalidOperationException("Role not found");
        }

        return await MapToRoleDto(role);
    }

    public async Task<PaginatedResult<RoleDto>> GetRolesAsync(int page = 1, int pageSize = 10, string? search = null)
    {
        var roles = await _roleRepository.GetAllAsync();
        
        if (!string.IsNullOrEmpty(search))
        {
            roles = roles.Where(r => 
                r.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                r.Description.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        var totalCount = roles.Count();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var pagedRoles = roles
            .Skip((page - 1) * pageSize)
            .Take(pageSize);

        var roleDtos = new List<RoleDto>();
        foreach (var role in pagedRoles)
        {
            roleDtos.Add(await MapToRoleDto(role));
        }

        return new PaginatedResult<RoleDto>
        {
            Items = roleDtos,
            TotalCount = totalCount,
            TotalPages = totalPages,
            CurrentPage = page,
            PageSize = pageSize
        };
    }

    public async Task DeleteRoleAsync(Guid id)
    {
        await _roleRepository.DeleteAsync(id);
    }

    private async Task<RoleDto> MapToRoleDto(Role role)
    {
        var permissions = role.RolePermissions.Select(rp => rp.Permission.Name).ToList();

        return new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            IsActive = role.IsActive,
            TenantId = role.TenantId,
            Permissions = permissions,
            CreatedAt = role.CreatedAt,
            UpdatedAt = role.UpdatedAt
        };
    }
}
