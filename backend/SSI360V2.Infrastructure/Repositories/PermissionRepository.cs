using Microsoft.EntityFrameworkCore;
using SSI360V2.Core.Entities;
using SSI360V2.Core.Interfaces;
using SSI360V2.Infrastructure.Data;

namespace SSI360V2.Infrastructure.Repositories;

public class PermissionRepository : Repository<Permission>, IPermissionRepository
{
    public PermissionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Permission>> GetByRoleAsync(Guid roleId)
    {
        return await _dbSet
            .Where(p => p.RolePermissions.Any(rp => rp.RoleId == roleId))
            .ToListAsync();
    }
}
