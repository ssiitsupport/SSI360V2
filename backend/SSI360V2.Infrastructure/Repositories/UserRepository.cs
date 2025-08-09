using Microsoft.EntityFrameworkCore;
using SSI360V2.Core.Entities;
using SSI360V2.Core.Interfaces;
using SSI360V2.Infrastructure.Data;

namespace SSI360V2.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .Include(u => u.Tenant)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetByTenantAsync(Guid tenantId)
    {
        return await _dbSet
            .Include(u => u.Tenant)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .Where(u => u.TenantId == tenantId)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetByRoleAsync(Guid roleId)
    {
        return await _dbSet
            .Include(u => u.Tenant)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .Where(u => u.UserRoles.Any(ur => ur.RoleId == roleId))
            .ToListAsync();
    }
}
